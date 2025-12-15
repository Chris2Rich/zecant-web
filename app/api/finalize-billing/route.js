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

        const { subscriptionId } = await req.json();
        if (!subscriptionId) {
            return NextResponse.json({ error: "Missing subscriptionId" }, { status: 400 });
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
            expand: ["latest_invoice.payment_intent"],
        });

        const paymentIntent = subscription.latest_invoice?.payment_intent;
        if (!paymentIntent || paymentIntent.status !== "succeeded") {
            return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
        }

        const user = await (await clerkClient()).users.getUser(userId);
        const tier = user.privateMetadata?.pendingTier;
        const tierData = billingTiers[tier];
        if (!tierData) {
            return NextResponse.json({ error: "Invalid pending tier" }, { status: 400 });
        }

        const currentCredits = user.publicMetadata?.credits || 0;
        const newCredits = currentCredits + tierData.credits;

        await (await clerkClient()).users.updateUserMetadata(userId, {
            publicMetadata: {
                ...user.publicMetadata,
                billingTier: tier,
                credits: newCredits,
                onboarded: true,
                // Initialize brokers to an empty list if none exists yet
                brokers: Array.isArray(user.publicMetadata?.brokers)
                    ? user.publicMetadata.brokers
                    : [],
            },
            privateMetadata: {
                ...user.privateMetadata,
                stripeSubscriptionId: subscriptionId,
                pendingTier: null,
            },
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Finalize billing error:", err);
        return NextResponse.json({ error: err.message || "Failed to finalize billing" }, { status: 500 });
    }
}
