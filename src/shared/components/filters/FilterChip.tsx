import React from 'react';

export interface FilterChipProps {
  readonly isArabic: boolean;
  readonly isActive: boolean;
  readonly label: string;
  readonly value: string;
  readonly onClick: () => void;
  readonly onClear?: () => void;
  readonly onDarkBackground?: boolean;
}

export const FilterChip: React.FC<FilterChipProps> = React.memo(({
  isActive,
  label,
  value,
  onClick,
  onClear,
  onDarkBackground = false,
}) => {
  const chipClass = onDarkBackground
    ? `inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all duration-200 flex-shrink-0 cursor-pointer select-none ${
        isActive
          ? "bg-white/15 border-white/50 text-white font-semibold"
          : "bg-transparent border-white/30 text-white hover:bg-white/10 hover:border-white/50"
      }`
    : `inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all duration-200 flex-shrink-0 cursor-pointer select-none ${
        isActive
          ? "bg-accent/10 border-accent/40 text-accent font-semibold shadow-sm"
          : "bg-surface border-line text-ink hover:border-line-strong hover:bg-canvas"
      }`;

  return (
    <div
      className={chipClass}
      onClick={onClick}
    >
      <span className="truncate max-w-[110px]">{label}</span>
      {value ? (
        <>
          <span className="text-[10px] opacity-50">/</span>
          <span className="truncate max-w-[85px]">{value}</span>
        </>
      ) : null}
      {onClear ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          className="w-4 h-4 rounded-full hover:bg-accent/20 flex items-center justify-center text-accent text-sm leading-none transition-colors ml-1"
          title="Clear filter"
        >
          ×
        </button>
      ) : (
        <span className="text-[8px] opacity-60">▼</span>
      )}
    </div>
  );
});

FilterChip.displayName = 'FilterChip';
