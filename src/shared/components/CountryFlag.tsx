import React from 'react';

type MarketCode = 'JO' | 'SA' | 'LB' | 'PS' | 'SY';

interface Props {
  readonly code: MarketCode;
}

const FLAG_SRC: Record<MarketCode, string> = {
  JO: '/jo.jpg',
  SA: '/sa.jpg',
  LB: '/lb.jpg',
  PS: '/ps.jpg',
  SY: '/sy.jpg',
};

/**
 * Country flag indicator — ISOLATED.
 *
 * Position is absolute → moving the flag NEVER affects other header
 * elements (FOX wordmark, avatar, menu).
 *
 * To adjust horizontal position, change ONE token: `end-N`.
 *   end-4  → 16px from the LEFT edge (RTL)   [current]
 *   end-6  → 24px from the LEFT edge
 *   end-2  → 8px from the LEFT edge
 *
 * Flag visual:
 *   - JPG from public/ root (compressed later)
 *   - 40px circular crop with subtle ring + soft glow
 */
export const CountryFlag: React.FC<Props> = ({ code }) => {
  return (
    <div
      className="absolute top-1/2 -translate-y-1/2 end-4 z-10 pointer-events-none"
      aria-hidden="true"
    >
      <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-white/20 shadow-[0_0_12px_rgba(255,255,255,0.15)] bg-white/5">
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
