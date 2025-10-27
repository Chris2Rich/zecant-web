import { auth, clerkClient } from "@clerk/nextjs/server";
import jwt from "@tsndr/cloudflare-worker-jwt";

export const config = {
  runtime: "edge",
};

const WS_SECRET = process.env.WS_SECRET;
const WS_SERVER_URL = "wss://localhost";

export default async function handler(req) {
  try {
    // --- 1️⃣ Clerk authentication ---
    const { userId } = auth();

    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // --- 2️⃣ Fetch user data and billing info ---
    const user = await clerkClient.users.getUser(userId);
    const tier = user.publicMetadata?.billingTier || "free";
    const usage = user.publicMetadata?.usage || 0;
    
    const limit_map = {"free": 3, "plus": 10, "pro": 100, "enterprise": 1500}
    const limit = limit_map[tier];

    if (usage >= limit) {
      return new Response(JSON.stringify({ error: "Usage limit exceeded" }), { status: 403 });
    }

    // --- 3️⃣ Sign short-lived token (valid 1 minute) ---
    const token = await jwt.sign(
      {
        sub: userId,
        tier,
        exp: Math.floor(Date.now() / 1000) + 60,
      },
      WS_SECRET
    );

    // --- 4️⃣ Return signed WS URL ---
    const ws_url = `${WS_SERVER_URL}?token=${token}`;
    return new Response(JSON.stringify({ ws_url }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
