import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

const SNAPTRADE_BASE_URL = "https://api.snaptrade.com/api/v1";

async function fetchSnaptrade(path, { snaptradeClientId, snaptradeSecret, params }) {
  const url = new URL(`${SNAPTRADE_BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Client-Id": snaptradeClientId,
      "Consumer-Key": snaptradeSecret,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`SnapTrade GET ${path} failed (${res.status}): ${text || res.statusText}`);
  }

  const data = await res.json().catch(() => null);
  if (!data) {
    throw new Error(`SnapTrade GET ${path} returned empty body`);
  }

  return data;
}

function computeTotalNavFromBalances(balances) {
  if (!Array.isArray(balances)) return 0;
  // SnapTrade balance schemas may vary; sum any numeric 'marketValue' or 'value' field as a best-effort NAV.
  return balances.reduce((total, b) => {
    const v =
      typeof b.marketValue === "number"
        ? b.marketValue
        : typeof b.value === "number"
        ? b.value
        : 0;
    return total + v;
  }, 0);
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const snaptradeClientId = process.env.SNAPTRADE_CLIENT_ID;
    const snaptradeSecret = process.env.SNAPTRADE_SECRET;

    if (!snaptradeClientId || !snaptradeSecret) {
      console.error("SnapTrade configuration missing: SNAPTRADE_CLIENT_ID or SNAPTRADE_SECRET");
      // Still return a 200 with an empty payload so the frontend can handle gracefully.
      return NextResponse.json({
        connected: false,
        snaptradeConfigured: false,
        accounts: [],
        totalNav: 0,
        positions: [],
        trades: [],
      });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    const snaptradeUserId = user.privateMetadata?.snaptradeUserId || userId;
    const snaptradeUserSecret = user.privateMetadata?.snaptradeUserSecret;

    if (!snaptradeUserSecret) {
      // User has not started/finished SnapTrade connection yet
      return NextResponse.json({
        connected: false,
        snaptradeConfigured: true,
        accounts: [],
        totalNav: 0,
        positions: [],
        trades: [],
      });
    }

    try {
      // These endpoints/paths are based on SnapTrade docs; if they change, errors are caught and surfaced as empty data.
      const [accounts, balances, positions, trades] = await Promise.all([
        fetchSnaptrade("/snapTrade/accounts", {
          snaptradeClientId,
          snaptradeSecret,
          params: { userId: snaptradeUserId, userSecret: snaptradeUserSecret },
        }),
        fetchSnaptrade("/snapTrade/holdings", {
          snaptradeClientId,
          snaptradeSecret,
          params: { userId: snaptradeUserId, userSecret: snaptradeUserSecret },
        }),
        fetchSnaptrade("/snapTrade/positions", {
          snaptradeClientId,
          snaptradeSecret,
          params: { userId: snaptradeUserId, userSecret: snaptradeUserSecret },
        }),
        fetchSnaptrade("/snapTrade/activities", {
          snaptradeClientId,
          snaptradeSecret,
          params: { userId: snaptradeUserId, userSecret: snaptradeUserSecret },
        }),
      ]);

      const totalNav = computeTotalNavFromBalances(balances);

      return NextResponse.json({
        connected: true,
        snaptradeConfigured: true,
        accounts,
        totalNav,
        positions,
        trades,
      });
    } catch (snapErr) {
      console.error("Error fetching data from SnapTrade:", snapErr);
      // If SnapTrade fails, indicate that it's unavailable but don't break the app.
      return NextResponse.json({
        connected: true,
        snaptradeConfigured: true,
        snaptradeError: true,
        accounts: [],
        totalNav: 0,
        positions: [],
        trades: [],
      });
    }
  } catch (err) {
    console.error("Broker data retrieval error:", err);
    return NextResponse.json(
      { error: "Failed to fetch broker data. Please try again later." },
      { status: 500 },
    );
  }
}


