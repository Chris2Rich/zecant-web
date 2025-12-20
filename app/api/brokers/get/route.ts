import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Snaptrade } from "snaptrade-typescript-sdk";

function getSnaptradeClient(clientId: string, consumerKey: string) {
  return new Snaptrade({
    clientId: clientId,
    consumerKey: consumerKey,
  });
}

function computeTotalNavFromPositions(positions: any[]) {
  if (!Array.isArray(positions)) return 0;
  
  // SnapTrade positions have: price, quantity, and symbol
  // Calculate market value as price * quantity
  return positions.reduce((total, position) => {
    console.log(position.price, position.fractional_units)
    const price = (position.price);
    const quantity = Number(position.fractional_units);
    const marketValue = price * Math.abs(quantity); // Use abs for short positions
    return total + marketValue;
  }, 0);
}

function formatTrades(activities: any[]) {
  if (!Array.isArray(activities)) return [];
  
  // Filter for actual trades (buy/sell) and format them
  return activities
    .filter((activity: any) => {
      const type = activity.type?.toLowerCase() || "";
      return type.includes("buy") || type.includes("sell") || type.includes("trade");
    })
    .map((activity: any) => ({
      date: activity.trade_date || activity.settlement_date || activity.date,
      timestamp: activity.trade_date || activity.settlement_date,
      side: activity.type,
      type: activity.type,
      symbol: activity.symbol?.symbol || activity.symbol,
      ticker: activity.symbol?.symbol || activity.symbol,
      quantity: Math.abs(activity.units || activity.quantity || 0),
      qty: Math.abs(activity.units || activity.quantity || 0),
      price: activity.price || 0,
      amount: activity.amount || 0,
      fee: activity.fee || 0,
      description: activity.description,
    }))
    .sort((a, b) => {
      // Sort by date descending (most recent first)
      const dateA = new Date(a.timestamp || 0).getTime();
      const dateB = new Date(b.timestamp || 0).getTime();
      return dateB - dateA;
    });
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

      // Fetch accounts first
      const accountsResp = await snaptrade.accountInformation.listUserAccounts({
        userId: snaptradeUserId as string,
        userSecret: snaptradeUserSecret as string,
      });

      const accounts = accountsResp?.data ?? accountsResp ?? [];
      
      if (accounts.length === 0) {
        return NextResponse.json({
          connected: true,
          snaptradeConfigured: true,
          accounts: [],
          totalNav: 0,
          positions: [],
          trades: [],
        });
      }

      // Fetch positions and activities for each account
      const allPositions: any[] = [];
      const allActivities: any[] = [];

      for (const account of accounts) {
        try {
          // Get positions (holdings) for this account
          const positionsResp = await snaptrade.accountInformation.getUserAccountPositions({
            userId: snaptradeUserId as string,
            userSecret: snaptradeUserSecret as string,
            accountId: account.id as string,
          });
          const positions = positionsResp?.data ?? positionsResp ?? [];
          allPositions.push(...positions);

          // Get activities (trades) for this account
          const activitiesResp = await snaptrade.transactionsAndReporting.getActivities({
            userId: snaptradeUserId as string,
            userSecret: snaptradeUserSecret as string,
            accountId: account.id as string, // Pass account ID to get account-specific activities
            // Optional: Add date range filters
            // startDate: "2024-01-01",
            // endDate: new Date().toISOString().split('T')[0],
          });
          const activities = activitiesResp?.data ?? activitiesResp ?? [];
          allActivities.push(...activities);
        } catch (accountErr) {
          console.error(`Error fetching data for account ${account.id}:`, accountErr);
          // Continue with other accounts even if one fails
        }
      }

      // Calculate total NAV from all positions
      const totalNav = computeTotalNavFromPositions(allPositions);

      // Format and filter trades
      const trades = formatTrades(allActivities);

      return NextResponse.json({
        connected: true,
        snaptradeConfigured: true,
        accounts: accounts.map((acc: any) => ({
          id: acc.id,
          name: acc.name,
          accountNumber: acc.number,
          brokerage: acc.institution_name || acc.brokerage_name,
          type: acc.type,
        })),
        totalNav,
        positions: allPositions,
        trades,
      });
    } catch (snapErr: any) {
      console.error("Error fetching data from SnapTrade:", snapErr);
      console.error("Error details:", snapErr.response?.data || snapErr.message);
      
      return NextResponse.json({
        connected: true,
        snaptradeConfigured: true,
        snaptradeError: true,
        errorMessage: snapErr.message,
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