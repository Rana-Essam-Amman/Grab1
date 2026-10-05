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
 *   end-8  → 32px from the LEFT edge (RTL)   [current]
 *
 * Flag visual:
 *   - JPG from public/ root (compressed later)
 *   - 56px circular crop with subtle ring + soft glow
 *   - 35° clockwise tilt from 0° baseline
 */
export const CountryFlag: React.FC<Props> = ({ code }) => {
  return (
    <div
      className="absolute top-1/2 -translate-y-1/2 end-8 z-10 pointer-events-none"
      aria-hidden="true"
    >
      <div className="w-14 h-14 rotate-[35deg] rounded-full overflow-hidden ring-1 ring-white/25 shadow-[0_0_18px_rgba(255,255,255,0.20)] bg-white/5">
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
