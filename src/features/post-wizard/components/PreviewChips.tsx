import React from 'react';

interface ChipItem {
  readonly key: string;
  readonly label: string;
  readonly value: string;
  readonly isCustom?: boolean;
}

interface Props {
  readonly items: readonly ChipItem[];
  readonly isArabic: boolean;
  readonly maxVisible?: number;
}

export const PreviewChips: React.FC<Props> = ({
  items,
  isArabic,
  maxVisible = 6,
}) => {
  const filled = items.filter((it) => it.value.trim().length > 0);
  if (filled.length === 0) return null;

  const visible = filled.slice(0, maxVisible);
  const remaining = filled.length - visible.length;

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {visible.map((it) => (
        <span
          key={it.key}
          className={
            it.isCustom
              ? 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent/10 text-accent border border-accent/40'
              : 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-canvas text-ink-soft border border-line'
          }
        >
          {it.isCustom && (
            <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
          )}
          <span className="opacity-70">{it.label}:</span>
          <span>{it.value}</span>
        </span>
      ))}
      {remaining > 0 && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold text-ink-muted border border-dashed border-line">
          {isArabic ? `+${remaining}` : `+${remaining}`}
        </span>
      )}
    </div>
  );
};
