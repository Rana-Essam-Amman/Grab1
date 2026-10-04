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
 * Country flag indicator for the header.
 *
 * ISOLATED — absolutely positioned so any position tweak (e.g.
 * end-14 → end-16) does NOT affect other header elements.
 *
 * To adjust position: change ONE class on outer div:
 *   end-14 → end-16  (8px inward)
 *   end-14 → end-12  (8px outward)
 *
 * Melt-into-header: circular + subtle ring + soft outer glow.
 */
export const CountryFlag: React.FC<Props> = ({ code }) => {
  return (
    <div
      className="absolute top-1/2 -translate-y-1/2 end-14 z-10 pointer-events-none"
      aria-hidden="true"
    >
      <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-white/15 shadow-[0_0_10px_rgba(255,255,255,0.10)] opacity-95">
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
