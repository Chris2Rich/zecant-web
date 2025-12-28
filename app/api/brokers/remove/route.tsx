import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Snaptrade } from "snaptrade-typescript-sdk";

function getSnaptradeClient(clientId: string, consumerKey: string) {
  return new Snaptrade({
    clientId: clientId,
    consumerKey: consumerKey,
  });
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { authorizationId } = body;

    if (!authorizationId) {
      return NextResponse.json(
        { error: "Missing authorizationId" },
        { status: 400 }
      );
    }

    const snaptradeClientId = process.env.SNAPTRADE_CLIENT_ID;
    const snaptradeSecret = process.env.SNAPTRADE_SECRET;

    if (!snaptradeClientId || !snaptradeSecret) {
      console.error("SnapTrade configuration missing");
      return NextResponse.json(
        { error: "Broker connection is not configured." },
        { status: 500 }
      );
    }

    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);

    const snaptradeUserId = user.privateMetadata?.snaptradeUserId || userId;
    const snaptradeUserSecret = user.privateMetadata?.snaptradeUserSecret;

    if (!snaptradeUserSecret) {
      return NextResponse.json(
        { error: "SnapTrade not configured for this user" },
        { status: 400 }
      );
    }

    // Delete the authorization from SnapTrade
    try {
      const snaptrade = getSnaptradeClient(snaptradeClientId, snaptradeSecret);
      
      await snaptrade.connections.removeBrokerageAuthorization({
        authorizationId: authorizationId,
        userId: snaptradeUserId as string,
        userSecret: snaptradeUserSecret as string,
      });
    } catch (snaptradeError) {
      console.error("SnapTrade deletion error:", snaptradeError);
      // Continue anyway to remove from Clerk metadata
    }

    // Remove from Clerk metadata
    const existingBrokers = (user.publicMetadata?.brokers as string[]) || [];
    const updatedBrokers = existingBrokers.filter(
      (broker) => broker !== authorizationId
    );

    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        brokers: updatedBrokers,
      },
    });

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Broker removal error:", err);
    return NextResponse.json(
      { error: "Failed to remove broker connection." },
      { status: 500 }
    );
  }
}