import React from 'react';

type MarketCode = 'JO' | 'LB' | 'PS' | 'SY' | 'SA';

interface CountryFlagProps {
  readonly code: MarketCode;
  readonly size?: number;
  readonly className?: string;
}

const VIEW_W = 32;
const VIEW_H = 22;
const STRIPE_H = VIEW_H / 3;

const FLAG_BANDS: Record<MarketCode, readonly [string, string, string]> = {
  JO: ['#0B0B0B', '#FFFFFF', '#1B7A3E'],
  LB: ['#C8102E', '#FFFFFF', '#C8102E'],
  PS: ['#0B0B0B', '#FFFFFF', '#1B7A3E'],
  SY: ['#C8102E', '#FFFFFF', '#0B0B0B'],
  SA: ['#1B7A3E', '#1B7A3E', '#1B7A3E'],
};

const HAS_TRIANGLE: Record<MarketCode, boolean> = {
  JO: true,
  LB: false,
  PS: true,
  SY: false,
  SA: false,
};

export const CountryFlag: React.FC<CountryFlagProps> = ({
  code,
  size = 30,
  className,
}) => {
  const bands = FLAG_BANDS[code] || FLAG_BANDS.JO;
  const hasTriangle = HAS_TRIANGLE[code];
  const filterId = `brush-flag-${code}`;

  return (
    <svg
      width={size}
      height={(size * VIEW_H) / VIEW_W}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className={className}
      aria-hidden="true"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <defs>
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.035 0.07"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2.4"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
      <g filter={`url(#${filterId})`}>
        <rect x="0" y="0" width={VIEW_W} height={STRIPE_H} fill={bands[0]} />
        <rect x="0" y={STRIPE_H} width={VIEW_W} height={STRIPE_H} fill={bands[1]} />
        <rect
          x="0"
          y={STRIPE_H * 2}
          width={VIEW_W}
          height={STRIPE_H}
          fill={bands[2]}
        />
        {hasTriangle && (
          <polygon
            points={`0,0 ${VIEW_W * 0.42},${VIEW_H / 2} 0,${VIEW_H}`}
            fill="#C8102E"
          />
        )}
      </g>
    </svg>
  );
};
