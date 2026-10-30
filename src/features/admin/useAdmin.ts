import { useState, useEffect, useCallback } from 'react';
import * as rpc from './adminRpc';
import type { MarketCode, PaymentParams } from './adminRpc';

export function useAdmin() {
  const [market, setMarketState] = useState<MarketCode>('JO');
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const refresh = useCallback(async (m: MarketCode = market) => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await rpc.getDashboard(m);
    if (err) setError(err.message || 'Failed to load dashboard');
    else setDashboard(data);
    setLoading(false);
  }, [market]);

  const setMarket = useCallback((m: MarketCode) => {
    setMarketState(m);
    refresh(m);
  }, [refresh]);

  useEffect(() => {
    refresh('JO');
  }, [refresh]);

  const runAction = useCallback(async (actionFn: () => Promise<{ error: Error | null }>) => {
    setActionLoading(true);
    setError(null);
    try {
      const { error: err } = await actionFn();
      if (err) throw err;
      await refresh();
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage || 'Action failed');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [refresh]);

  const dismissReport = (id: string) => runAction(() => rpc.actionReport(id, 'dismiss'));
  const hideListing = (id: string) => runAction(() => rpc.hideListing(id));
  const banUser = (id: string, reason: string) => runAction(() => rpc.banUser(id, reason));
  const unbanUser = (id: string) => runAction(() => rpc.unbanUser(id));
  const recordPayment = (params: PaymentParams) => runAction(() => rpc.recordPayment(params));

  return {
    market,
    dashboard,
    loading,
    error,
    actionLoading,
    setMarket,
    refresh,
    dismissReport,
    hideListing,
    banUser,
    unbanUser,
    recordPayment,
  };
}
