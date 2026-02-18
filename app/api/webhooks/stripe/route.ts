import { NextResponse } from "next/server";
import Stripe from "stripe";
import { clerkClient } from "@clerk/nextjs/server";
import { billingTiers } from "@/business/constants.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const processedEvents = new Set();

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

function isEventProcessed(eventId) {
  if (processedEvents.has(eventId)) {
    return true;
  }
  processedEvents.add(eventId);
  if (processedEvents.size > 1000) {
    const arr = Array.from(processedEvents).slice(-500);
    processedEvents.clear();
    arr.forEach(id => processedEvents.add(id));
  }
  return false;
}

async function getCustomerAndUserId(customerId) {
  if (!customerId) return null;
  
  const customer = await stripe.customers.retrieve(customerId);
  if (!customer || customer.deleted || !customer.metadata?.clerkUserId) {
    return null;
  }
  
  return {
    customer,
    clerkUserId: customer.metadata.clerkUserId,
  };
}

async function handleInvoicePaid(invoice, eventId) {
  if (isEventProcessed(eventId)) {
    console.log(`Skipping already processed event: ${eventId}`);
    return;
  }

  if (invoice.billing_reason === "subscription_create") {
    console.log(`Skipping initial invoice (handled by finalize-billing): ${eventId}`);
    return;
  }

  const customerId = invoice.customer;
  const subscriptionId = invoice.subscription;
  
  if (!customerId || !subscriptionId) {
    console.error("Invoice paid event missing customer or subscription ID");
    return;
  }

  const result = await getCustomerAndUserId(customerId);
  if (!result) {
    console.error(`Customer ${customerId} not found or has no clerkUserId metadata`);
    return;
  }

  const { clerkUserId } = result;
  
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = subscription.items.data[0]?.price.id;
  const tierName = getTierFromPriceId(priceId);
  const subscriptionCredits = getCreditsForTier(tierName);

  const client = await clerkClient();
  const user = await client.users.getUser(clerkUserId);
  
  const purchasedCredits = user.publicMetadata?.purchasedCredits || 0;
  const totalCredits = subscriptionCredits + purchasedCredits;

  await client.users.updateUserMetadata(clerkUserId, {
    publicMetadata: {
      ...user.publicMetadata,
      billingTier: tierName,
      subscriptionCredits,
      purchasedCredits,
      credits: totalCredits,
      subscriptionStatus: "active",
      lastCreditReset: new Date().toISOString(),
    },
    privateMetadata: {
      ...user.privateMetadata,
      stripeSubscriptionId: subscriptionId,
    },
  });

  console.log(`Reset subscription credits to ${subscriptionCredits} for user ${clerkUserId} (tier: ${tierName}, total: ${totalCredits})`);
}

async function handleInvoicePaymentFailed(invoice, eventId) {
  if (isEventProcessed(eventId)) {
    console.log(`Skipping already processed event: ${eventId}`);
    return;
  }

  const customerId = invoice.customer;
  
  if (!customerId) {
    console.error("Invoice payment_failed event missing customer ID");
    return;
  }

  const result = await getCustomerAndUserId(customerId);
  if (!result) {
    console.error(`Customer ${customerId} not found or has no clerkUserId metadata`);
    return;
  }

  const { clerkUserId } = result;
  const freeCredits = billingTiers.Free.credits;

  const client = await clerkClient();
  const user = await client.users.getUser(clerkUserId);

  const purchasedCredits = user.publicMetadata?.purchasedCredits || 0;
  const totalCredits = freeCredits + purchasedCredits;

  await client.users.updateUserMetadata(clerkUserId, {
    publicMetadata: {
      ...user.publicMetadata,
      billingTier: "Free",
      subscriptionCredits: freeCredits,
      purchasedCredits,
      credits: totalCredits,
      subscriptionStatus: "past_due",
    },
  });

  console.log(`Payment failed: reset user ${clerkUserId} to Free tier (${freeCredits} subscription credits, ${purchasedCredits} purchased credits)`);
}

async function handleCustomerSubscriptionDeleted(subscription, eventId) {
  if (isEventProcessed(eventId)) {
    console.log(`Skipping already processed event: ${eventId}`);
    return;
  }

  const customerId = subscription.customer;
  
  if (!customerId) {
    console.error("Subscription deleted event missing customer ID");
    return;
  }

  const result = await getCustomerAndUserId(customerId);
  if (!result) {
    console.error(`Customer ${customerId} not found or has no clerkUserId metadata`);
    return;
  }

  const { clerkUserId } = result;
  const freeCredits = billingTiers.Free.credits;

  const client = await clerkClient();
  const user = await client.users.getUser(clerkUserId);

  const purchasedCredits = user.publicMetadata?.purchasedCredits || 0;
  const totalCredits = freeCredits + purchasedCredits;

  await client.users.updateUserMetadata(clerkUserId, {
    publicMetadata: {
      ...user.publicMetadata,
      billingTier: "Free",
      subscriptionCredits: freeCredits,
      purchasedCredits,
      credits: totalCredits,
      subscriptionStatus: "canceled",
    },
    privateMetadata: {
      ...user.privateMetadata,
      stripeSubscriptionId: null,
    },
  });

  console.log(`Canceled: reset user ${clerkUserId} to Free tier`);
}

async function handleCustomerSubscriptionUpdated(subscription, eventId) {
  if (isEventProcessed(eventId)) {
    console.log(`Skipping already processed event: ${eventId}`);
    return;
  }

  const customerId = subscription.customer;
  const priceId = subscription.items.data[0]?.price.id;
  
  if (!customerId) {
    console.error("Subscription updated event missing customer ID");
    return;
  }

  const result = await getCustomerAndUserId(customerId);
  if (!result) {
    console.error(`Customer ${customerId} not found or has no clerkUserId metadata`);
    return;
  }

  const { clerkUserId } = result;
  const tierName = getTierFromPriceId(priceId);
  const newStatus = subscription.status;

  const client = await clerkClient();
  const user = await client.users.getUser(clerkUserId);
  const currentTier = user.publicMetadata?.billingTier;
  const purchasedCredits = user.publicMetadata?.purchasedCredits || 0;

  if (currentTier !== tierName && newStatus === "active") {
    const subscriptionCredits = getCreditsForTier(tierName);
    const totalCredits = subscriptionCredits + purchasedCredits;
    
    await client.users.updateUserMetadata(clerkUserId, {
      publicMetadata: {
        ...user.publicMetadata,
        billingTier: tierName,
        subscriptionCredits,
        purchasedCredits,
        credits: totalCredits,
        subscriptionStatus: "active",
        lastCreditReset: new Date().toISOString(),
      },
    });

    console.log(`Tier change: updated user ${clerkUserId} to ${tierName} tier (${subscriptionCredits} subscription credits)`);
  } else {
    const statusMap = {
      active: "active",
      past_due: "past_due",
      canceled: "canceled",
      unpaid: "past_due",
    };

    const tierCredits = getCreditsForTier(tierName);
    const isDowngrade = newStatus === "canceled" || newStatus === "unpaid";
    const effectiveCredits = isDowngrade ? billingTiers.Free.credits : tierCredits;
    const totalCredits = effectiveCredits + purchasedCredits;
    
    await client.users.updateUserMetadata(clerkUserId, {
      publicMetadata: {
        ...user.publicMetadata,
        subscriptionCredits: effectiveCredits,
        purchasedCredits,
        credits: totalCredits,
        subscriptionStatus: statusMap[newStatus] || newStatus,
      },
    });

    console.log(`Status update: user ${clerkUserId} subscription status -> ${newStatus}`);
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
        await handleInvoicePaid(event.data.object, event.id);
        break;
      
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object, event.id);
        break;
      
      case "customer.subscription.deleted":
        await handleCustomerSubscriptionDeleted(event.data.object, event.id);
        break;
      
      case "customer.subscription.updated":
        await handleCustomerSubscriptionUpdated(event.data.object, event.id);
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
