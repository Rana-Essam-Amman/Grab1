import { useAuthStore } from '@/features/auth/store/auth.slice';

export const waitForSession = (
  userId: string,
  timeoutMs = 3000,
): Promise<boolean> =>
  new Promise((resolve) => {
    let settled = false;
    let unsubscribe = () => {};

    const finish = (matched: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      unsubscribe();
      resolve(matched);
    };

    const timeout = setTimeout(() => finish(false), timeoutMs);

    const hasSession = () => {
      const state = useAuthStore.getState();
      return Boolean(state.sessionToken && state.user?.id === userId);
    };

    unsubscribe = useAuthStore.subscribe(() => {
      if (hasSession()) finish(true);
    });

    if (hasSession()) finish(true);
  });
