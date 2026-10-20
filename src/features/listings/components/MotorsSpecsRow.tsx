import { useMemo } from 'react';
import { getMakeLabel, getModelLabel } from '@/data/brands';

interface MotorsSpecsRowProps {
  readonly make: string;
  readonly model: string;
  readonly trim: string;
  readonly isArabic: boolean;
}

export function MotorsSpecsRow({ make, model, trim, isArabic }: MotorsSpecsRowProps) {
  const parts = useMemo(() => {
    const out: string[] = [];
    if (make) out.push(getMakeLabel(make, isArabic));
    if (model) out.push(make ? getModelLabel(make, model, isArabic) : model);
    if (trim) out.push(trim);
    return out;
  }, [make, model, trim, isArabic]);

  if (parts.length === 0) return null;

  return (
    <div
      className="flex items-center flex-wrap gap-1 text-[12px] font-bold text-ink mt-1 mb-1"
      dir="auto"
      data-testid="motors-specs"
    >
      {parts.map((part, idx) => (
        <span key={`${part}-${idx}`} className="flex items-center gap-1">
          <span className="truncate max-w-[180px]">{part}</span>
          {idx < parts.length - 1 && <span className="text-ink-muted">·</span>}
        </span>
      ))}
    </div>
  );
}
