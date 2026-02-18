import { clerkClient } from "@clerk/nextjs/server";
import { billingTiers } from "@/business/constants.js";

export async function getCredits(userId) {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return {
    credits: user.publicMetadata?.credits || 0,
    billingTier: user.publicMetadata?.billingTier || "Free",
    subscriptionStatus: user.publicMetadata?.subscriptionStatus || "active",
  };
}

export async function addCredits(userId, amount, transactionType = "manual") {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  
  const currentCredits = user.publicMetadata?.credits || 0;
  const newCredits = currentCredits + amount;

  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      ...user.publicMetadata,
      credits: newCredits,
    },
  });

  return {
    previousCredits: currentCredits,
    addedCredits: amount,
    newCredits: newCredits,
  };
}

export async function setCredits(userId, amount) {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  const currentCredits = user.publicMetadata?.credits || 0;

  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      ...user.publicMetadata,
      credits: amount,
      lastCreditReset: new Date().toISOString(),
    },
  });

  return {
    previousCredits: currentCredits,
    newCredits: amount,
  };
}

export function getTierCredits(tierName) {
  return billingTiers[tierName]?.credits || billingTiers.Free.credits;
}

export async function resetToFreeTier(userId) {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      ...user.publicMetadata,
      billingTier: "Free",
      credits: billingTiers.Free.credits,
      subscriptionStatus: "canceled",
    },
    privateMetadata: {
      ...user.privateMetadata,
      stripeSubscriptionId: null,
    },
  });

  return { success: true, credits: billingTiers.Free.credits };
}
