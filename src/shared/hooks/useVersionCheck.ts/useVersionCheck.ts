import { useEffect, useState } from 'react';

const CHECK_INTERVAL_MS = 5 * 60 * 1000;
const SCRIPT_SRC_RE = /<script[^>]*\bsrc=["']([^"']+\.js)["']/;

async function fetchBundleTag(): Promise<string | null> {
  try {
    const res = await fetch(`/index.html?_v=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const html = await res.text();
    return html.match(SCRIPT_SRC_RE)?.[1] ?? null;
  } catch {
    return null;
  }
}

export function useVersionCheck(): boolean {
  const [newVersionAvailable, setNewVersionAvailable] = useState(false);

  useEffect(() => {
    let initial: string | null = null;
    let disposed = false;

    const check = async () => {
      const tag = await fetchBundleTag();
      if (disposed || !tag) return;
      if (initial === null) {
        initial = tag;
        return;
      }
      if (tag !== initial) setNewVersionAvailable(true);
    };

    void check();
    const id = window.setInterval(() => void check(), CHECK_INTERVAL_MS);
    const onVis = () => {
      if (document.visibilityState === 'visible') void check();
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      disposed = true;
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return newVersionAvailable;
}
