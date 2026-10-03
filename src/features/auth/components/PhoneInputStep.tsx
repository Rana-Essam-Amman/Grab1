import React from 'react';

interface Props {
  readonly phone: string;
  readonly setPhone: (v: string) => void;
  readonly error: string | null;
  readonly isArabic: boolean;
  readonly browseCountryCode: string;
  readonly onContinue: () => void;
  readonly onErrorClear: () => void;
}

export const PhoneInputStep: React.FC<Props> = ({
  phone,
  setPhone,
  error,
  isArabic,
  browseCountryCode,
  onContinue,
  onErrorClear,
}) => (
  <div className="flex flex-col gap-3">
    <label className="text-xs font-bold text-ink-soft">
      {isArabic ? `رقم الهاتف (${browseCountryCode})` : `Phone (${browseCountryCode})`}
    </label>
    <input
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      value={phone}
      onChange={(e) => {
        setPhone(e.target.value);
        if (error) onErrorClear();
      }}
      placeholder="+962 7X XXX XXXX"
      dir="ltr"
      className="w-full h-11 px-3 rounded-xl border border-line bg-canvas text-ink text-sm font-medium focus:outline-none focus:border-primary"
    />
    {error && <p className="text-xs font-bold text-danger">{error}</p>}
    <button
      type="button"
      onClick={onContinue}
      disabled={!phone.trim()}
      className="w-full h-12 rounded-xl bg-primary text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {isArabic ? 'متابعة' : 'Continue'}
    </button>
  </div>
);
