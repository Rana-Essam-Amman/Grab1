import React from 'react';

declare const __BUILD_HASH__: string;
declare const __BUILD_TIME__: string;

export const BuildBadge: React.FC = React.memo(() => {
  const hash = typeof __BUILD_HASH__ !== 'undefined' ? __BUILD_HASH__ : 'dev';
  const time = typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : '';
  return (
    <div
      data-testid="build-badge"
      style={{
        position: 'fixed',
        bottom: 4,
        left: 4,
        zIndex: 9999,
        fontSize: 9,
        fontFamily: 'monospace',
        color: '#94A3B8',
        background: 'rgba(255,255,255,0.85)',
        padding: '2px 6px',
        borderRadius: 4,
        pointerEvents: 'none',
        direction: 'ltr',
      }}
    >
      {hash} · {time}
    </div>
  );
});

BuildBadge.displayName = 'BuildBadge';
