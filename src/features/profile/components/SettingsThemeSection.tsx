import React from 'react';
import { Sun1, Moon, Setting2 } from 'iconsax-react';
import { useUIStore } from '@/store/ui.slice';

type ThemeOption = 'light' | 'dark' | 'auto';

interface Option {
  readonly key: ThemeOption;
  readonly labelAr: string;
  readonly labelEn: string;
  readonly Icon: typeof Sun1;
}

const OPTIONS: readonly Option[] = [
  { key: 'light', labelAr: 'فاتح', labelEn: 'Light', Icon: Sun1 },
  { key: 'dark', labelAr: 'داكن', labelEn: 'Dark', Icon: Moon },
  { key: 'auto', labelAr: 'تلقائي', labelEn: 'Auto', Icon: Setting2 },
];

interface SettingsThemeSectionProps {
  readonly isArabic: boolean;
}

export const SettingsThemeSection: React.FC<SettingsThemeSectionProps> = ({ isArabic }) => {
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);

  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xs">
      <div className="p-3 bg-background/40 border-b border-border text-xs font-bold text-ink uppercase tracking-wider">
        {isArabic ? 'المظهر' : 'Appearance'}
      </div>
      <div className="grid grid-cols-3">
        {OPTIONS.map(({ key, labelAr, labelEn, Icon }, idx) => {
          const active = theme === key;
          const isLast = idx === OPTIONS.length - 1;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTheme(key)}
              aria-pressed={active}
              className={`flex flex-col items-center gap-1.5 py-3.5 transition-colors cursor-pointer border-border ${
                !isLast ? 'border-e' : ''
              } ${
                active
                  ? 'bg-primary/5 text-primary'
                  : 'text-ink-muted hover:bg-surface-elevated'
              }`}
            >
              <Icon
                size={18}
                variant={active ? 'Bold' : 'Linear'}
                color={active ? '#E57E25' : undefined}
              />
              <span className="text-xs font-bold">
                {isArabic ? labelAr : labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
