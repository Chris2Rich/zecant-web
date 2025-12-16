import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

const SNAPTRADE_BASE_URL = "https://api.snaptrade.com/api/v1";

async function registerSnaptradeUser({ snaptradeClientId, snaptradeSecret, snaptradeUserId }) {
  const url = new URL(`${SNAPTRADE_BASE_URL}/snapTrade/registerUser`);
  console.log("[SnapTrade] registerUser: url", url.toString());
  console.log(
    "[SnapTrade] registerUser: have clientId?",
    !!snaptradeClientId,
    "have secret?",
    !!snaptradeSecret,
  );

  const authHeader =
    "Basic " + Buffer.from(`${snaptradeClientId}:${snaptradeSecret}`).toString("base64");

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify({ userId: snaptradeUserId }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("[SnapTrade] registerUser failed status", res.status, "body:", text);
    throw new Error(`SnapTrade registerUser failed (${res.status}): ${text || res.statusText}`);
  }

  const data = await res.json().catch(() => null);
  if (!data || !data.userSecret) {
    throw new Error("SnapTrade registerUser response missing userSecret");
  }

  return data.userSecret;
}

async function createSnaptradeConnectionUrl({
  snaptradeClientId,
  snaptradeSecret,
  snaptradeUserId,
  snaptradeUserSecret,
}) {
  const url = new URL(`${SNAPTRADE_BASE_URL}/snapTrade/login`);
  url.searchParams.set("userId", snaptradeUserId);
  url.searchParams.set("userSecret", snaptradeUserSecret);
  console.log("[SnapTrade] login: url", url.toString());
  console.log(
    "[SnapTrade] login: have clientId?",
    !!snaptradeClientId,
    "have secret?",
    !!snaptradeSecret,
  );

  const authHeader =
    "Basic " + Buffer.from(`${snaptradeClientId}:${snaptradeSecret}`).toString("base64");

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("[SnapTrade] login failed status", res.status, "body:", text);
    throw new Error(`SnapTrade login failed (${res.status}): ${text || res.statusText}`);
  }

  const data = await res.json().catch(() => null);
  if (!data || !data.redirectURI) {
    throw new Error("SnapTrade login response missing redirectURI");
  }

  return data.redirectURI;
}

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const snaptradeClientId = process.env.SNAPTRADE_CLIENT_ID;
    const snaptradeSecret = process.env.SNAPTRADE_SECRET;

    console.log("[SnapTrade] /api/brokers/connect POST for user", userId);
    console.log(
      "[SnapTrade] env check SNAPTRADE_CLIENT_ID set?",
      !!snaptradeClientId,
      "SNAPTRADE_SECRET set?",
      !!snaptradeSecret,
    );

    if (!snaptradeClientId || !snaptradeSecret) {
      console.error("SnapTrade configuration missing: SNAPTRADE_CLIENT_ID or SNAPTRADE_SECRET");
      return NextResponse.json(
        { error: "Broker connection is not configured. Please contact support." },
        { status: 500 },
      );
    }

    // Use Clerk userId as the stable SnapTrade userId
    const snaptradeUserId = userId;

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    let snaptradeUserSecret = user.privateMetadata?.snaptradeUserSecret;

    // If we don't have a stored userSecret, register the user with SnapTrade
    if (!snaptradeUserSecret) {
      snaptradeUserSecret = await registerSnaptradeUser({
        snaptradeClientId,
        snaptradeSecret,
        snaptradeUserId,
      });

      // Persist the secret for future calls
      await client.users.updateUserMetadata(userId, {
        privateMetadata: {
          ...user.privateMetadata,
          snaptradeUserId,
          snaptradeUserSecret,
        },
      });
    }

    const connectUrl = await createSnaptradeConnectionUrl({
      snaptradeClientId,
      snaptradeSecret,
      snaptradeUserId,
      snaptradeUserSecret,
    });

    return NextResponse.json({ status: "ok", url: connectUrl });
  } catch (err) {
    console.error("Broker connection setup error:", err);
    return NextResponse.json(
      { error: "Failed to initiate broker connection. Please try again later." },
      { status: 500 },
    );
  }
}


