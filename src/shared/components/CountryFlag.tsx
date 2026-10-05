import React from 'react';

type MarketCode = 'JO' | 'SA' | 'LB' | 'PS' | 'SY';

interface Props {
  readonly code: MarketCode;
}

// ─── ADJUST HERE ───────────────────────────────────────────────
// Flag display size in px.
//   80 = medium   |  96 = large (current)  |  112 = XL
const FLAG_SIZE_PX = 96;

// Resting tilt angle (degrees). Negative = counter-clockwise.
const FLAG_ROTATE_DEG = -10;

// Distance from the flag to the nearest edge of the header.
//   end-2 = 8px   end-3 = 12px   end-4 = 16px   end-8 = 32px
const FLAG_END_CLASS = 'end-3';
// ──────────────────────────────────────────────────────────────

const FLAG_SRC: Record<MarketCode, string> = {
  JO: '/flags/jo.jpg',
  SA: '/flags/sa.jpg',
  LB: '/flags/lb.jpg',
  PS: '/flags/ps.jpg',
  SY: '/flags/sy.jpg',
};

// Subtle wave: oscillates ±4° around the resting tilt.
const WAVE_KEYFRAMES = `
@keyframes flagWave {
  0%   { transform: rotate(-10deg); }
  25%  { transform: rotate(-14deg); }
  50%  { transform: rotate(-10deg); }
  75%  { transform: rotate(-6deg); }
  100% { transform: rotate(-10deg); }
}
`;

/**
 * Country flag indicator.
 * Circular crop, gently waving into the navy header.
 *
 * To resize  → FLAG_SIZE_PX
 * To tilt    → FLAG_ROTATE_DEG (and the keyframes if you want a different sweep)
 * To move    → FLAG_END_CLASS
 */
export const CountryFlag: React.FC<Props> = ({ code }) => {
  return (
    <>
      <style>{WAVE_KEYFRAMES}</style>
      <div
        className={`absolute top-1/2 -translate-y-1/2 ${FLAG_END_CLASS} z-10 pointer-events-none`}
        aria-hidden="true"
      >
        <div
          className="rounded-full overflow-hidden"
          style={{
            width: FLAG_SIZE_PX,
            height: FLAG_SIZE_PX,
            transform: `rotate(${FLAG_ROTATE_DEG}deg)`,
            animation: 'flagWave 3.5s ease-in-out infinite',
            transformOrigin: 'center center',
          }}
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
    </>
  );
};
