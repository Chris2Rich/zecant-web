"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorData, SnapTradeReact } from "snaptrade-react";
import { PortfolioDisplay } from "@/components/PortfolioDisplay"; // Adjust path as needed

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
  const [loginLink, setLoginLink] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const brokers = (user?.publicMetadata as any)?.brokers;
  const hasBrokers = Array.isArray(brokers) && brokers.length > 0;

  const loadBrokerData = async () => {
    try {
      setLoadingData(true);
      setError(null);
      const res = await fetch("/api/brokers/get", { method: "GET" });
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      const data = (await res.json()) as BrokerData;
      setBrokerData(data);
    } catch (err: any) {
      console.error("Failed to load broker data:", err);
      setError("Unable to load broker data right now.");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (!hasBrokers) return;
    loadBrokerData();
  }, [hasBrokers]);

  const handleConnectBroker = async () => {
    try {
      setConnecting(true);
      setError(null);
      const res = await fetch("/api/brokers/connect", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.loginLink) {
        throw new Error(data?.error || "Failed to start broker connection.");
      }
      setLoginLink(data.loginLink);
      setModalOpen(true);
    } catch (err: any) {
      console.error("Failed to start broker connection:", err);
      setError("Unable to start broker connection. Please try again.");
    } finally {
      setConnecting(false);
    }
  };

  const handleSuccess = async (authorizationId: string) => {
    try {
      setModalOpen(false);
      setLoginLink(null);
      const res = await fetch("/api/brokers/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorizationId }),
      });
      if (!res.ok) {
        throw new Error("Failed to save broker connection.");
      }
      await user?.reload();
      await loadBrokerData();
    } catch (err: any) {
      console.error("Failed to handle broker success:", err);
      setError("Broker connected but failed to save. Please try again.");
    }
  };

  const handleError = (errorMessage: ErrorData) => {
    setError(JSON.stringify(errorMessage));
    setModalOpen(false);
    setLoginLink(null);
  };

  const handleExit = () => {
    setModalOpen(false);
    setLoginLink(null);
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
        {loginLink && (
          <SnapTradeReact
            loginLink={loginLink}
            isOpen={modalOpen}
            onSuccess={handleSuccess}
            onError={handleError}
            onExit={handleExit}
            close={() => setModalOpen(false)}
          />
        )}
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
    <>
      {error && (
        <div className="mb-6 p-4 rounded-sm border border-red-500/20 bg-red-500/10 text-red-500">
          {error}
        </div>
      )}

      {brokerData && !brokerData.connected && (
        <div className="rounded-sm border border-border-divider bg-card/70 backdrop-blur-glass p-8 text-center">
          <p className="text-muted-foreground">
            No SnapTrade-connected brokerage accounts were found yet. Once you
            finish connecting a broker, your portfolio details will appear here.
          </p>
        </div>
      )}

      {brokerData && brokerData.connected && (
        <PortfolioDisplay
          accounts={brokerData.accounts}
          totalNav={brokerData.totalNav}
          positions={brokerData.positions}
          trades={brokerData.trades}
        />
      )}
    </>
  );
}