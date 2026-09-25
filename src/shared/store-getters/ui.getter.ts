import type { UIState } from '@/store/ui.slice.types';
import type { MarketCode } from '@/shared/lib/marketGate';

let _getUI: (() => UIState) | null = null;

export function registerUIGetter(getter: () => UIState): void {
  _getUI = getter;
}

export function getUISnapshot(): UIState {
  if (!_getUI) {
    throw new Error('[Registration] UI store getter not registered. Call registerUIGetter() at app boot.');
  }
  return _getUI();
}

export function getBrowseCountryCode(): MarketCode {
  return getUISnapshot().browseCountryCode as MarketCode;
}

export function getActiveCurrency(): string {
  return getUISnapshot().activeCurrency;
}
