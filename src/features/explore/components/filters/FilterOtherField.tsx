import React, { useState } from 'react';

interface FilterOtherFieldProps {
  readonly isArabic: boolean;
  readonly activeValue: string;
  readonly knownValues: readonly string[];
  readonly onChange: (value: string | null) => void;
  readonly variant?: 'chip' | 'input-only';
}

export const FilterOtherField: React.FC<FilterOtherFieldProps> = ({
  isArabic,
  activeValue,
  knownValues,
  onChange,
  variant = 'chip',
}) => {
  const otherLabel = isArabic ? 'أخرى — اكتب يدوياً' : 'Other — type manually';
  const isOtherActive = Boolean(activeValue && !knownValues.includes(activeValue));
  const [show, setShow] = useState(isOtherActive);
  const [text, setText] = useState(isOtherActive ? activeValue : '');

  const handleInput = (v: string) => {
    setText(v);
    onChange(v.trim() ? v : null);
  };

  const handleToggle = () => {
    if (show) {
      setShow(false);
      setText('');
      onChange(null);
    } else {
      setShow(true);
    }
  };

  return (
    <>
      {variant === 'chip' && (
        <button
          type="button"
          onClick={handleToggle}
          className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
            show
              ? 'bg-accent/15 border-accent text-accent'
              : 'bg-surface border-border text-ink'
          }`}
        >
          {otherLabel}
        </button>
      )}
      {show && (
        <input
          type="text"
          value={text}
          onChange={(e) => handleInput(e.target.value)}
          placeholder={isArabic ? 'اكتب...' : 'Type...'}
          className="w-full h-9 px-3 rounded-lg border border-border bg-surface text-ink text-xs font-medium focus:outline-none focus:border-accent"
          autoFocus
        />
      )}
    </>
  );
};
