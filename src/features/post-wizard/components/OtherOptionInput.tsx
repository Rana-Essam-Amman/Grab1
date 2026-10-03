import React from 'react';

interface Props {
  readonly value: string;
  readonly onChange: (v: string) => void;
  readonly placeholder: string;
  readonly isArabic: boolean;
}

export const OtherOptionInput: React.FC<Props> = ({
  value,
  onChange,
  placeholder,
  isArabic,
}) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    dir={isArabic ? 'rtl' : 'ltr'}
    className="mt-2 w-full rounded-xl border border-line bg-canvas/20 px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-accent"
  />
);
