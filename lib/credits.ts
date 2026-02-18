import { clerkClient } from "@clerk/nextjs/server";
import { billingTiers } from "@/business/constants.js";

export async function getCredits(userId) {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  
  const subscriptionCredits = user.publicMetadata?.subscriptionCredits ?? user.publicMetadata?.credits ?? 0;
  const purchasedCredits = user.publicMetadata?.purchasedCredits ?? 0;
  
  return {
    subscriptionCredits,
    purchasedCredits,
    credits: subscriptionCredits + purchasedCredits,
    billingTier: user.publicMetadata?.billingTier || "Free",
    subscriptionStatus: user.publicMetadata?.subscriptionStatus || "active",
  };
}

export async function addPurchasedCredits(userId, amount) {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  
  const currentPurchased = user.publicMetadata?.purchasedCredits ?? 0;
  const subscriptionCredits = user.publicMetadata?.subscriptionCredits ?? 0;
  const newPurchased = currentPurchased + amount;
  const totalCredits = subscriptionCredits + newPurchased;

  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      ...user.publicMetadata,
      purchasedCredits: newPurchased,
      credits: totalCredits,
    },
  });

  return {
    previousPurchasedCredits: currentPurchased,
    addedCredits: amount,
    newPurchasedCredits: newPurchased,
    totalCredits,
  };
}

export async function setSubscriptionCredits(userId, amount) {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  const purchasedCredits = user.publicMetadata?.purchasedCredits ?? 0;
  const totalCredits = amount + purchasedCredits;

  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      ...user.publicMetadata,
      subscriptionCredits: amount,
      credits: totalCredits,
      lastCreditReset: new Date().toISOString(),
    },
  });

  return {
    subscriptionCredits: amount,
    purchasedCredits,
    totalCredits,
  };
}

export function getTierCredits(tierName) {
  return billingTiers[tierName]?.credits || billingTiers.Free.credits;
}

export async function resetToFreeTier(userId) {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  const purchasedCredits = user.publicMetadata?.purchasedCredits ?? 0;
  const freeCredits = billingTiers.Free.credits;
  const totalCredits = freeCredits + purchasedCredits;

  await client.users.updateUserMetadata(userId, {
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

  return { 
    success: true, 
    subscriptionCredits: freeCredits,
    purchasedCredits,
    totalCredits,
  };
}
