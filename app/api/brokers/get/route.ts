import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Snaptrade } from "snaptrade-typescript-sdk";

function getSnaptradeClient(clientId: string, consumerKey: string) {
  return new Snaptrade({
    clientId: clientId,
    consumerKey: consumerKey,
  });
}

function computeTotalNavFromBalances(balances: any[]) {
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

    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);

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
      const snaptrade = getSnaptradeClient(snaptradeClientId, snaptradeSecret);

      // Use SDK high-level endpoints; shape may vary slightly but we treat them as opaque lists.
      const [accountsResp, activitiesResp] = await Promise.all([
        snaptrade.accountInformation.listUserAccounts({
          userId: snaptradeUserId as string,
          userSecret: snaptradeUserSecret as string,
        }),
        snaptrade.transactionsAndReporting.getActivities({
          userId: snaptradeUserId as string,
          userSecret: snaptradeUserSecret as string,
        }),
      ]);
      
      const accounts = accountsResp?.data ?? accountsResp ?? [];
      const holdings: any[] = [];
      const trades = activitiesResp?.data ?? activitiesResp ?? [];
      for (const account of accounts) {
        const holdingsResp = await snaptrade.accountInformation.getUserAccountPositions({
          userId: snaptradeUserId as string,
          userSecret: snaptradeUserSecret as string,
          accountId: account.id as string,
        });
        holdings.push(...(holdingsResp?.data ?? holdingsResp ?? []));
      }

      const totalNav = computeTotalNavFromBalances(holdings);

      return NextResponse.json({
        connected: true,
        snaptradeConfigured: true,
        accounts,
        totalNav,
        positions: holdings,
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


