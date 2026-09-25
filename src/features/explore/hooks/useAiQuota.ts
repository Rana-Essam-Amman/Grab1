import { useState, useCallback, useEffect, useMemo } from 'react';
import { z } from 'zod';
import { useUI } from '@/hooks/useUI';
import { marketStorage } from '@/shared/lib/marketStorage';

export interface UseAiQuotaReturn {
  quota: number;
  shareModalOpen: boolean;
  setShareModalOpen: (open: boolean) => void;
  handleShareUnlock: () => void;
  consumeQuota: () => boolean;
}

const QUOTA_KEY = 'ai_quota_v1';
const QUOTA_SCHEMA = z.object({
  credits: z.number().min(0).default(5),
  lastReset: z.string().optional(),
});
const DEFAULT_QUOTA = { credits: 5 } as const;

export const useAiQuota = (): UseAiQuotaReturn => {
  const { browseCountryCode } = useUI();
  const storage = useMemo(() => marketStorage(browseCountryCode), [browseCountryCode]);

  const [quota, setQuota] = useState<number>(() => {
    const raw = storage.get<unknown>(QUOTA_KEY);
    const parsed = QUOTA_SCHEMA.safeParse(raw);
    return parsed.success ? parsed.data.credits : DEFAULT_QUOTA.credits;
  });
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    const validated = QUOTA_SCHEMA.parse({ credits: quota });
    storage.set(QUOTA_KEY, validated);
  }, [quota, storage]);

  const handleShareUnlock = useCallback(() => {
    setQuota((prev) => Math.min(prev + 5, 10));
    setShareModalOpen(false);
  }, []);

  const consumeQuota = useCallback(() => {
    if (quota <= 0) {
      setShareModalOpen(true);
      return false;
    }
    setQuota((prev) => Math.max(prev - 1, 0));
    return true;
  }, [quota]);

  return {
    quota,
    shareModalOpen,
    setShareModalOpen,
    handleShareUnlock,
    consumeQuota,
  };
};
