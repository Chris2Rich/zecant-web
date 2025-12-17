import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

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

    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);

    // Update user metadata to mark broker as connected
    const existingBrokers = (user.publicMetadata?.brokers as string[]) || [];
    const updatedBrokers = existingBrokers.includes(authorizationId)
      ? existingBrokers
      : [...existingBrokers, authorizationId];

    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        brokers: updatedBrokers,
      },
      privateMetadata: {
        ...user.privateMetadata,
        lastAuthorizationId: authorizationId,
      },
    });

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Broker callback error:", err);
    return NextResponse.json(
      { error: "Failed to process broker callback." },
      { status: 500 }
    );
  }
}
