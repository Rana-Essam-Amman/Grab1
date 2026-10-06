import React from 'react';

type MarketCode = 'JO' | 'SA' | 'LB' | 'PS' | 'SY';

interface Props {
  readonly code: MarketCode;
  readonly onClick?: () => void;
  readonly ariaLabel?: string;
}

// ─── ADJUST HERE ───────────────────────────────────────────────
// Flag display size in px.
//   64 = small   |  80 = medium (current)  |  96 = large
const FLAG_SIZE_PX = 80;

// Tilt angle in degrees — gives the "waving" feel.
//   Negative = counter-clockwise  |  Positive = clockwise
//   Try: -8, -10, -12
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

/**
 * Country flag indicator.
 * Circular crop, tilted slightly so it "waves" into the navy header.
 *
 * To resize  → FLAG_SIZE_PX
 * To tilt    → FLAG_ROTATE_DEG
 * To move    → FLAG_END_CLASS
 */
export const CountryFlag: React.FC<Props> = ({ code, onClick, ariaLabel }) => {
  const interactive = Boolean(onClick);
  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 ${FLAG_END_CLASS} z-10 ${
        interactive
          ? 'pointer-events-auto cursor-pointer active:scale-95 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-full'
          : 'pointer-events-none'
      }`}
      aria-hidden={interactive ? undefined : true}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? (ariaLabel || 'Change market') : undefined}
      onClick={onClick}
      onKeyDown={
        interactive
          ? (e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      <div
        className="rounded-full overflow-hidden"
        style={{
          width: FLAG_SIZE_PX,
          height: FLAG_SIZE_PX,
          transform: `rotate(${FLAG_ROTATE_DEG}deg)`,
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
  );
};
