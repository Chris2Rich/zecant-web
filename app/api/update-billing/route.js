import { NextResponse } from "next/server";
import Stripe from "stripe";
import { clerkClient, auth } from "@clerk/nextjs/server";
import { billingTiers } from "@/business/constants.js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export async function POST(req) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { billingTier } = await req.json();
    const tierData = billingTiers[billingTier];
    if (!tierData) {
      return NextResponse.json({ error: "Invalid billing tier" }, { status: 400 });
    }

    const user = await clerkClient.users.getUser(userId);

    let stripeCustomerId = user.privateMetadata?.stripeCustomerId;

    // ✅ Create Stripe customer if not exists
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses[0]?.emailAddress,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        metadata: { clerkUserId: user.id },
      });
      stripeCustomerId = customer.id;
    }

    // ✅ Create or update subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: "active",
      limit: 1,
    });

    let subscription;
    if (subscriptions.data.length > 0) {
      // Update existing subscription to new tier
      const sub = subscriptions.data[0];
      subscription = await stripe.subscriptions.update(sub.id, {
        items: [
          {
            id: sub.items.data[0].id,
            price: tierData.priceId,
          },
        ],
        proration_behavior: "create_prorations",
      });
    } else {
      // Create a new subscription
      subscription = await stripe.subscriptions.create({
        customer: stripeCustomerId,
        items: [{ price: tierData.priceId }],
        payment_behavior: "default_incomplete",
        expand: ["latest_invoice.payment_intent"],
      });
    }

    const currentCredits = user.publicMetadata?.credits || 0;
    const newCredits = currentCredits + tierData.credits;

    // ✅ Update Clerk metadata
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        billingTier,
        credits: newCredits,
        onboarded: true,
      },
      privateMetadata: {
        ...user.privateMetadata,
        stripeCustomerId,
        stripeSubscriptionId: subscription.id,
      },
    });

    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Failed to update user" }, { status: 500 });
  }
}