import React from 'react';

type MarketCode = 'JO' | 'SA' | 'LB' | 'PS' | 'SY';

interface Props {
  readonly code: MarketCode;
}

// ─── ADJUST HERE ───────────────────────────────────────────────
// Flag display size in px (width = height, circular crop).
// Common values: 56 (small), 64 (current), 72, 80 (large).
const FLAG_SIZE_PX = 64;

// Distance from the flag to the nearest edge of the header.
//   end-2 = 8px   end-3 = 12px   end-4 = 16px   end-8 = 32px
const FLAG_END_CLASS = 'end-3';
// ──────────────────────────────────────────────────────────────

const FLAG_SRC: Record<MarketCode, string> = {
  JO: '/jo.jpg',
  SA: '/sa.jpg',
  LB: '/lb.jpg',
  PS: '/ps.jpg',
  SY: '/sy.jpg',
};

/**
 * Country flag indicator.
 * Renders a plain circular crop of the JPG with no ring/glow so it
 * visually melts into the navy header background.
 *
 * To resize → change FLAG_SIZE_PX.
 * To move → change FLAG_END_CLASS.
 */
export const CountryFlag: React.FC<Props> = ({ code }) => {
  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 ${FLAG_END_CLASS} z-10 pointer-events-none`}
      aria-hidden="true"
    >
      <div
        className="rounded-full overflow-hidden"
        style={{ width: FLAG_SIZE_PX, height: FLAG_SIZE_PX }}
      >
        <img
          src={FLAG_SRC[code]}
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
          draggable={false}
        />
      </div>
    </div>
  );
};
