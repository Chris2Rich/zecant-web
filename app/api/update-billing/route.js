import { NextResponse } from "next/server";
import Stripe from "stripe";
import { clerkClient, auth } from "@clerk/nextjs/server";
import { billingTiers } from "@/business/constants.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { billingTier } = await req.json();
    const tierData = billingTiers[billingTier];
    if (!tierData) {
      return NextResponse.json({ error: "Invalid billing tier" }, { status: 400 });
    }

    const user = await (await clerkClient()).users.getUser(userId);

    if (!tierData.priceId || tierData.price === 0) {
      const subscriptionCredits = tierData.credits;
      const purchasedCredits = user.publicMetadata?.purchasedCredits || 0;
      const totalCredits = subscriptionCredits + purchasedCredits;

      await (await clerkClient()).users.updateUserMetadata(userId, {
        publicMetadata: {
          ...user.publicMetadata,
          billingTier,
          subscriptionCredits,
          purchasedCredits,
          credits: totalCredits,
          onboarded: true,
          subscriptionStatus: "active",
          lastCreditReset: new Date().toISOString(),
          brokers: Array.isArray(user.publicMetadata?.brokers)
          ? user.publicMetadata.brokers
          : [],
        },
        privateMetadata: {
          ...user.privateMetadata,
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          pendingTier: null,
        },
      });

      return NextResponse.json({
        success: true,
        free: true,
      });
    }

    let stripeCustomerId = user.privateMetadata?.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses[0]?.emailAddress,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        metadata: { clerkUserId: user.id },
      });
      stripeCustomerId = customer.id;
    }

    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: tierData.priceId }],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });

    await (await clerkClient()).users.updateUserMetadata(userId, {
      privateMetadata: {
        ...user.privateMetadata,
        stripeCustomerId,
        stripeSubscriptionId: subscription.id,
        pendingTier: billingTier,
      },
    });

    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
    });
  } catch (err) {
    console.error("Billing setup error:", err);
    return NextResponse.json({ error: err.message || "Failed to create billing" }, { status: 500 });
  }
}
