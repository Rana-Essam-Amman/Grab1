import React from 'react';
import { Call, Send2 } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

interface ThreadInputBarProps {
  isMessageLimitReached: boolean;
  isArabic: boolean;
  formattedPhone: { dialNumber?: string; displayFormatted?: string };
  inputText: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSend: (e: React.FormEvent) => void;
}

export const ThreadInputBar: React.FC<ThreadInputBarProps> = ({
  isMessageLimitReached,
  isArabic,
  formattedPhone,
  inputText,
  handleInputChange,
  handleSend,
}) => {
  if (isMessageLimitReached) {
    return (
      <div className="p-4 bg-surface border-t border-border flex flex-col gap-3 animate-in fade-in slide-in-from-bottom duration-300">
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center text-xs text-primary font-bold leading-relaxed">
          {isArabic
            ? 'لقد وصلت للحد الأقصى من الرسائل، يرجى الاتصال بالبائع فوراً لإتمام الاتفاق'
            : 'You have reached the maximum allowed messages. Please call the seller directly to finalize the deal.'}
        </div>
        {formattedPhone.dialNumber && (
          <a
            href={`tel:${formattedPhone.dialNumber}`}
            className="w-full h-12 rounded-xl bg-primary hover:opacity-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
          >
            <Call size={16} variant="Linear" color="#FFFFFF" />
            <span>
              {isArabic
                ? `اتصل بالبائع: ${formattedPhone.displayFormatted}`
                : `Call Seller: ${formattedPhone.displayFormatted}`}
            </span>
          </a>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSend}
      className="p-3 bg-surface border-t border-border flex items-center gap-2"
      dir="ltr"
    >
      <div className="flex-1">
        <Input
          value={inputText}
          onChange={handleInputChange}
          placeholder={isArabic ? 'اكتب رسالتك للمعلن...' : 'Type a message...'}
          className="h-11 px-4 rounded-full bg-surface border border-border text-xs text-ink focus:outline-none focus:border-primary"
          dir={isArabic ? 'rtl' : 'ltr'}
        />
      </div>
      <Button
        type="submit"
        disabled={!inputText.trim()}
        className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
          inputText.trim()
            ? 'bg-primary text-white shadow-sm active:scale-95'
            : 'bg-background text-ink-muted cursor-not-allowed'
        }`}
      >
        <Send2 size={16} variant="Linear" color={inputText.trim() ? "#FFFFFF" : "#94A3B8"} className="transform rotate-45" />
      </Button>
    </form>
  );
};
