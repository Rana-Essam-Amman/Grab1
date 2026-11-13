function isQuotaError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false;
  const name = 'name' in error ? error.name : undefined;
  const code = 'code' in error ? error.code : undefined;
  return name === 'QuotaExceededError' || code === 22;
}

export function persist(key: string, json: string, cleanupOnQuota: boolean): boolean {
  try {
    localStorage.setItem(key, json);
    return true;
  } catch (quotaError: unknown) {
    if (!isQuotaError(quotaError)) throw quotaError;
    console.warn('[safeStorage] Quota exceeded for ' + key + '.');
    if (!cleanupOnQuota) return false;
    try {
      localStorage.removeItem('chat_conversations');
      localStorage.setItem(key, json);
      return true;
    } catch {
      console.error('[safeStorage] Quota still exceeded. Data not saved.');
      return false;
    }
  }
}
