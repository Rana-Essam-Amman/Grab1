import type { MarketCode } from './marketGate';

export function assertMarketIsolation(
  items: Array<{ id?: string; countryCode?: string }>,
  expectedMarket: MarketCode,
  context: string
): void {
  if (!import.meta.env.DEV) return;
  const leaks = items.filter((item) => item.countryCode && item.countryCode !== expectedMarket);
  if (leaks.length > 0) {
    console.error(
      `❌ [MARKET LEAK] ${leaks.length} item(s) from another market rendered in "${expectedMarket}"`,
      { context, leaks: leaks.map((l) => ({ id: l.id, countryCode: l.countryCode })) }
    );
  }
}
