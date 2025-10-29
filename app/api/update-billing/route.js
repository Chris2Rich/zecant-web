import { NextResponse } from "next/server";
import Stripe from "stripe";
import { clerkClient, auth } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export async function POST(req) {
  try {
    // Get the currently authenticated user
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { billingTier } = await req.json();
    if (!billingTier) {
      return NextResponse.json({ error: "Missing billingTier" }, { status: 400 });
    }

    // Fetch user from Clerk
    const user = await clerkClient.users.getUser(userId);

    // Create Stripe customer if it doesn't exist yet
    let stripeCustomerId = user.privateMetadata?.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses[0]?.emailAddress,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        metadata: {
          clerkUserId: user.id,
        },
      });

      stripeCustomerId = customer.id;
    }

    // Update Clerk user publicMetadata
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        billingTier,
        onboarded: true,
      },
      privateMetadata: {
        ...user.privateMetadata,
        stripeCustomerId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}