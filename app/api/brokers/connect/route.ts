import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Snaptrade } from "snaptrade-typescript-sdk";

const SNAPTRADE_BASE_URL = "https://api.snaptrade.com/api/v1";

function getSnaptradeClient(clientId: string, consumerKey: string) {
  // SDK handles wiring clientId / consumerKey into the correct auth mechanism.
  return new Snaptrade({
    clientId: clientId,
    consumerKey: consumerKey,
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
    const loginResp = await snaptrade.authentication.loginSnapTradeUser({
      userId: snaptradeUserId,
      userSecret: snaptradeUserSecret as string,
      darkMode: true,
      // broker and other options can be provided later; for now use defaults (all brokers via portal)
    });

    console.log("loginResp", loginResp);
    console.log("loginResp.data", loginResp.data);
    const loginData = loginResp?.data || null;
    return NextResponse.json({ status: "ok", url: loginData as string });
  } catch (err) {
    console.error("Broker connection setup error:", err);
    return NextResponse.json(
      { error: "Failed to initiate broker connection. Please try again later." },
      { status: 500 },
    );
  }
}


