import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Snaptrade } from "snaptrade-typescript-sdk";

const SNAPTRADE_BASE_URL = "https://api.snaptrade.com/api/v1";

function getSnaptradeClient(clientId, consumerKey) {
  // SDK handles wiring clientId / consumerKey into the correct auth mechanism.
  return new Snaptrade({
    clientId,
    consumerKey,
  });
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

    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);

    let snaptradeUserSecret = user.privateMetadata?.snaptradeUserSecret;

    // If we don't have a stored userSecret, register the user with SnapTrade
    if (!snaptradeUserSecret) {
      const snaptrade = getSnaptradeClient(snaptradeClientId, snaptradeSecret);
      console.log("[SnapTrade] Calling SDK registerSnapTradeUser for", snaptradeUserId);
      const resp = await snaptrade.authentication.registerSnapTradeUser({
        userId: snaptradeUserId,
      });

      const data = resp?.data || resp;
      snaptradeUserSecret = data?.userSecret;

      if (!snaptradeUserSecret) {
        console.error("[SnapTrade] SDK registerSnapTradeUser response missing userSecret", data);
        return NextResponse.json(
          { error: "Failed to register broker user. Please contact support." },
          { status: 500 },
        );
      }

      // Persist the secret for future calls
      await clerk.users.updateUserMetadata(userId, {
        privateMetadata: {
          ...user.privateMetadata,
          snaptradeUserId,
          snaptradeUserSecret,
        },
      });
    }

    const snaptrade = getSnaptradeClient(snaptradeClientId, snaptradeSecret);
    console.log("[SnapTrade] Calling SDK loginSnapTradeUser for", snaptradeUserId);
    const loginResp = await snaptrade.authentication.loginSnapTradeUser({
      userId: snaptradeUserId,
      userSecret: snaptradeUserSecret,
      // broker and other options can be provided later; for now use defaults (all brokers via portal)
    });

    const loginData = loginResp?.data || loginResp;
    const connectUrl = loginData?.redirectURI;

    if (!connectUrl) {
      console.error("[SnapTrade] SDK loginSnapTradeUser response missing redirectURI", loginData);
      return NextResponse.json(
        { error: "Failed to start broker connection. Please contact support." },
        { status: 500 },
      );
    }

    return NextResponse.json({ status: "ok", url: connectUrl });
  } catch (err) {
    console.error("Broker connection setup error:", err);
    return NextResponse.json(
      { error: "Failed to initiate broker connection. Please try again later." },
      { status: 500 },
    );
  }
}


