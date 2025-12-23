"use client";

import { useEffect, useRef, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { Loader2, RefreshCcw, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorData, SnapTradeReact } from "snaptrade-react";
import { PortfolioDisplay } from "@/components/PortfolioDisplay";
import { useSidebarContext } from "@/components/SidebarContext"

interface BrokerData {
  connected: boolean;
  accounts: any[];
  totalNav: number;
  positions: any[];
  trades: any[];
  cached?: boolean;
  cache_age_minutes?: number;
  last_fetched_at?: string;
  error?: string;
}

const API_BASE_URL = "https://api.zecant.com";

interface PortfolioPageProps {
  user: ReturnType<typeof useUser>["user"];
  isLoaded: boolean;
  brokerData: BrokerData | null;
  loadingData: boolean;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  handleRefresh: (forceRefresh?: boolean) => void;
}

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  const { register, unregister } = useSidebarContext()
  const refreshHandlerRef = useRef<(() => void) | null>(null);

  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [brokerData, setBrokerData] = useState<BrokerData | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefresh = async (forceRefresh: boolean = false) => {
    try {
      if (!forceRefresh) {
        setLoadingData(true);
      }
      setError(null);

      // Get auth token from Clerk
      const token = await getToken();
      if (!token) {
        throw new Error("Not authenticated");
      }

      // Fetch from new Python backend endpoint
      const url = forceRefresh 
        ? `${API_BASE_URL}/data/portfolio?refresh=true`
        : `${API_BASE_URL}/data/portfolio`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.error || `Request failed with status ${res.status}`);
      }

      const data = (await res.json()) as BrokerData;
      setBrokerData(data);

      // Show error from backend if present
      if (data.error) {
        setError(data.error);
      }
    } catch (err: any) {
      console.error("Failed to load broker data:", err);
      setError(err.message || "Unable to load broker data right now.");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    const regId = register([
      { icon: RefreshCcw, label: "Refresh Data", fn: handleRefresh },
    ])

    return () => unregister(regId)
  }, [register, unregister])

  const portfolioPageProps: PortfolioPageProps = {
    user,
    isLoaded,
    brokerData,
    loadingData,
    error,
    setError,
    handleRefresh
  };

  return <>
    <PortfolioPage {...portfolioPageProps}
    />
  </>
}

export function PortfolioPage({ 
  user,
  isLoaded,
  brokerData,
  loadingData,
  error,
  setError,
  handleRefresh
}: PortfolioPageProps) {
  const [connecting, setConnecting] = useState(false);
  const [loginLink, setLoginLink] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const brokers = (user?.publicMetadata as any)?.brokers;
  const hasBrokers = Array.isArray(brokers) && brokers.length > 0;

  useEffect(() => {
    if (!hasBrokers) return;
    handleRefresh(true);
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
      // Force refresh to get fresh data after connecting
      await handleRefresh(true);
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
    <div className="px-4 scrollbar-thin overflow-y-auto">
      {error && (
        <div className="mb-6 rounded-sm border border-red-500/20 bg-red-500/10 text-red-500">
          {error}
        </div>
      )}

      {brokerData && !brokerData.connected && (
        <div className="rounded-sm border border-border-divider bg-card/70 backdrop-blur-glass py-8 px-4 text-center">
          <p className="text-muted-foreground">
            No SnapTrade-connected brokerage accounts were found yet. Once you
            finish connecting a broker, your portfolio details will appear here.
          </p>
        </div>
      )}

      {brokerData && brokerData.connected && (
        <div className="space-y-4 h-full">
          <PortfolioDisplay
            accounts={brokerData.accounts}
            totalNav={brokerData.totalNav}
            positions={brokerData.positions}
            trades={brokerData.trades}
          />
        </div>
      )}
    </div>
  );
}