import { useState, useCallback, useEffect } from 'react';
import { readValidated, writeValidated } from '@/shared/lib/safeStorage';
import { z } from 'zod';

export interface UseAiQuotaReturn {
  quota: number;
  shareModalOpen: boolean;
  setShareModalOpen: (open: boolean) => void;
  handleShareUnlock: () => void;
  consumeQuota: () => boolean;
}

const QUOTA_KEY = 'krakeeb_ai_quota_v1';
const QUOTA_SCHEMA = z.object({
  credits: z.number().default(5),
  lastReset: z.string().optional(),
});

export const useAiQuota = (): UseAiQuotaReturn => {
  const [quota, setQuota] = useState<number>(() => {
    const data = readValidated(QUOTA_KEY, QUOTA_SCHEMA, { credits: 5 });
    return data ? data.credits : 5;
  });
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    writeValidated(QUOTA_KEY, QUOTA_SCHEMA, { credits: quota });
  }, [quota]);

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
