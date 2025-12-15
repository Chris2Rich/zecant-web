"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BrokerData {
  connected: boolean;
  snaptradeConfigured?: boolean;
  snaptradeError?: boolean;
  accounts: any[];
  totalNav: number;
  positions: any[];
  trades: any[];
}

export default function PortfolioPage() {
  const { user, isLoaded } = useUser();
  const [brokerData, setBrokerData] = useState<BrokerData | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  // Brokers metadata may be missing; treat missing/non-array as no brokers.
  const brokers = (user?.publicMetadata as any)?.brokers;
  const hasBrokers = Array.isArray(brokers) && brokers.length > 0;

  useEffect(() => {
    if (!hasBrokers) return;

    let cancelled = false;
    const load = async () => {
      try {
        setLoadingData(true);
        setError(null);
        const res = await fetch("/api/brokers/get", { method: "GET" });
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        const data = (await res.json()) as BrokerData;
        if (!cancelled) {
          setBrokerData(data);
        }
      } catch (err: any) {
        console.error("Failed to load broker data:", err);
        if (!cancelled) {
          setError("Unable to load broker data right now.");
        }
      } finally {
        if (!cancelled) {
          setLoadingData(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [hasBrokers]);

  const handleConnectBroker = async () => {
    try {
      setConnecting(true);
      setError(null);
      const res = await fetch("/api/brokers/connect", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.url) {
        throw new Error(data?.error || "Failed to start broker connection.");
      }
      // Redirect user to SnapTrade connection portal
      window.location.href = data.url;
    } catch (err: any) {
      console.error("Failed to start broker connection:", err);
      setError("Unable to start broker connection. Please try again.");
    } finally {
      setConnecting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!hasBrokers) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <Button size="lg" onClick={handleConnectBroker} disabled={connecting}>
          {connecting ? "Connecting..." : "Connect broker"}
        </Button>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }

  if (loadingData && !brokerData) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold mb-4">Portfolio</h1>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {brokerData && !brokerData.connected && (
        <p className="text-sm">
          No SnapTrade-connected brokerage accounts were found yet. Once you
          finish connecting a broker, your portfolio details will appear here.
        </p>
      )}

      {brokerData && brokerData.connected && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Connected brokerage accounts</h2>
            {Array.isArray(brokerData.accounts) && brokerData.accounts.length > 0 ? (
              <ul className="list-disc list-inside text-sm">
                {brokerData.accounts.map((acct: any, idx: number) => (
                  <li key={acct.id || idx}>
                    {acct.name || acct.accountNumber || "Account"}{" "}
                    {acct.brokerage && `(${acct.brokerage})`}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm">No accounts returned from broker.</p>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold">Total asset value (NAV)</h2>
            <p className="text-sm">
              {typeof brokerData.totalNav === "number"
                ? `$${brokerData.totalNav.toFixed(2)}`
                : "N/A"}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Past trades</h2>
            {Array.isArray(brokerData.trades) && brokerData.trades.length > 0 ? (
              <ul className="list-disc list-inside text-sm space-y-1">
                {brokerData.trades.map((t: any, idx: number) => (
                  <li key={t.id || idx}>
                    {t.date || t.timestamp || "Unknown date"}:{" "}
                    {t.side || t.type || "Trade"}{" "}
                    {t.symbol || t.ticker || "Unknown symbol"} —{" "}
                    {t.quantity ?? t.qty ?? "?"} @{" "}
                    {t.price !== undefined ? t.price : "?"}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm">No trades found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
