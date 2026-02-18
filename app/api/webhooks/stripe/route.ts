import { NextResponse } from "next/server";
import Stripe from "stripe";
import { clerkClient } from "@clerk/nextjs/server";
import { billingTiers } from "@/business/constants.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

function getCreditsForTier(tierName) {
  return billingTiers[tierName]?.credits || billingTiers.Free.credits;
}

function getTierFromPriceId(priceId) {
  for (const [tierName, tierData] of Object.entries(billingTiers)) {
    if (tierData.priceId === priceId) {
      return tierName;
    }
  }
  return "Free";
}

async function handleInvoicePaid(invoice) {
  const customerId = invoice.customer;
  const subscriptionId = invoice.subscription;
  
  if (!customerId) {
    console.error("Invoice paid event missing customer ID");
    return;
  }

  const customers = await stripe.customers.search({
    query: `id:'${customerId}'`,
    limit: 1,
  });
  
  const customer = customers.data[0];
  if (!customer || !customer.metadata?.clerkUserId) {
    console.error(`Customer ${customerId} has no clerkUserId metadata`);
    return;
  }

  const clerkUserId = customer.metadata.clerkUserId;
  
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = subscription.items.data[0]?.price.id;
  const tierName = getTierFromPriceId(priceId);
  const creditsToAdd = getCreditsForTier(tierName);

  const client = await clerkClient();
  const user = await client.users.getUser(clerkUserId);
  
  const currentCredits = user.publicMetadata?.credits || 0;
  const newCredits = currentCredits + creditsToAdd;

  await client.users.updateUserMetadata(clerkUserId, {
    publicMetadata: {
      ...user.publicMetadata,
      billingTier: tierName,
      credits: newCredits,
      subscriptionStatus: "active",
      lastCreditReset: new Date().toISOString(),
    },
    privateMetadata: {
      ...user.privateMetadata,
      stripeSubscriptionId: subscriptionId,
    },
  });

  console.log(`Added ${creditsToAdd} credits to user ${clerkUserId} (tier: ${tierName})`);
}

async function handleInvoicePaymentFailed(invoice) {
  const customerId = invoice.customer;
  
  if (!customerId) {
    console.error("Invoice payment_failed event missing customer ID");
    return;
  }

  const customers = await stripe.customers.search({
    query: `id:'${customerId}'`,
    limit: 1,
  });
  
  const customer = customers.data[0];
  if (!customer || !customer.metadata?.clerkUserId) {
    console.error(`Customer ${customerId} has no clerkUserId metadata`);
    return;
  }

  const clerkUserId = customer.metadata.clerkUserId;

  const client = await clerkClient();
  const user = await client.users.getUser(clerkUserId);

  await client.users.updateUserMetadata(clerkUserId, {
    publicMetadata: {
      ...user.publicMetadata,
      subscriptionStatus: "past_due",
    },
  });

  console.log(`Marked user ${clerkUserId} subscription as past_due`);
}

async function handleCustomerSubscriptionDeleted(subscription) {
  const customerId = subscription.customer;
  
  if (!customerId) {
    console.error("Subscription deleted event missing customer ID");
    return;
  }

  const customers = await stripe.customers.search({
    query: `id:'${customerId}'`,
    limit: 1,
  });
  
  const customer = customers.data[0];
  if (!customer || !customer.metadata?.clerkUserId) {
    console.error(`Customer ${customerId} has no clerkUserId metadata`);
    return;
  }

  const clerkUserId = customer.metadata.clerkUserId;
  const freeCredits = billingTiers.Free.credits;

  const client = await clerkClient();
  const user = await client.users.getUser(clerkUserId);

  await client.users.updateUserMetadata(clerkUserId, {
    publicMetadata: {
      ...user.publicMetadata,
      billingTier: "Free",
      credits: freeCredits,
      subscriptionStatus: "canceled",
    },
    privateMetadata: {
      ...user.privateMetadata,
      stripeSubscriptionId: null,
    },
  });

  console.log(`Downgraded user ${clerkUserId} to Free tier`);
}

async function handleCustomerSubscriptionUpdated(subscription) {
  const customerId = subscription.customer;
  const priceId = subscription.items.data[0]?.price.id;
  
  if (!customerId) {
    console.error("Subscription updated event missing customer ID");
    return;
  }

  const customers = await stripe.customers.search({
    query: `id:'${customerId}'`,
    limit: 1,
  });
  
  const customer = customers.data[0];
  if (!customer || !customer.metadata?.clerkUserId) {
    console.error(`Customer ${customerId} has no clerkUserId metadata`);
    return;
  }

  const clerkUserId = customer.metadata.clerkUserId;
  const tierName = getTierFromPriceId(priceId);
  const newStatus = subscription.status;

  const client = await clerkClient();
  const user = await client.users.getUser(clerkUserId);
  const currentTier = user.publicMetadata?.billingTier;

  if (currentTier !== tierName && newStatus === "active") {
    const newCredits = getCreditsForTier(tierName);
    
    await client.users.updateUserMetadata(clerkUserId, {
      publicMetadata: {
        ...user.publicMetadata,
        billingTier: tierName,
        credits: newCredits,
        subscriptionStatus: "active",
        lastCreditReset: new Date().toISOString(),
      },
    });

    console.log(`Updated user ${clerkUserId} to ${tierName} tier with ${newCredits} credits`);
  } else {
    const statusMap = {
      active: "active",
      past_due: "past_due",
      canceled: "canceled",
      unpaid: "past_due",
    };
    
    await client.users.updateUserMetadata(clerkUserId, {
      publicMetadata: {
        ...user.publicMetadata,
        subscriptionStatus: statusMap[newStatus] || newStatus,
      },
    });

    console.log(`Updated user ${clerkUserId} subscription status to ${newStatus}`);
  }
}

export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature || !webhookSecret) {
    console.error("Missing stripe-signature header or STRIPE_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "invoice.paid":
        await handleInvoicePaid(event.data.object);
        break;
      
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object);
        break;
      
      case "customer.subscription.deleted":
        await handleCustomerSubscriptionDeleted(event.data.object);
        break;
      
      case "customer.subscription.updated":
        await handleCustomerSubscriptionUpdated(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(`Error processing webhook ${event.type}:`, err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
