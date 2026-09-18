import React from 'react';
import { Button } from '@/shared/ui/Button';
import { Sparkles, Mic, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { Input } from '@/shared/ui/Input';
import { Textarea } from '@/shared/ui/Textarea';

interface Props {
  isArabic: boolean;
  noteText: string;
  isListening: boolean;
  loading: boolean;
  showManualForm: boolean;
  manualTitle: string;
  manualPrice: string;
  manualDesc: string;
  onNoteTextChange: (text: string) => void;
  onGenerate: () => void;
  onVoice: () => void;
  onToggleManual: () => void;
  onManualTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onManualPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onManualDescChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onManualSubmit: (e: React.FormEvent) => void;
}

export const AiDraftForm: React.FC<Props> = ({
  isArabic, noteText, isListening, loading, showManualForm, manualTitle, manualPrice, manualDesc,
  onNoteTextChange, onGenerate, onVoice, onToggleManual, onManualTitleChange, onManualPriceChange, 
  onManualDescChange, onManualSubmit
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className={`relative bg-surface rounded-3xl p-4 border transition-all duration-300 shadow-sm ${isListening ? 'border-primary ring-4 ring-primary/15 shadow-md' : 'border-border'}`}>
        {isListening && (
          <div className="flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-amber-50 text-primary text-xs font-bold border border-amber-200 animate-pulse w-max">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span>{isArabic ? 'جاري الاستماع والمعالجة...' : 'Listening & Processing...'}</span>
          </div>
        )}
        <textarea
          value={noteText}
          onChange={(e) => onNoteTextChange(e.target.value)}
          disabled={loading || isListening}
          rows={4}
          placeholder={isListening ? (isArabic ? 'جاري الاستماع...' : 'Listening...') : (isArabic ? 'اكتب تفاصيل إعلانك أو اضغط على المايكروفون...' : 'Write listing details or tap mic...')}
          className={`w-full bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none resize-none leading-relaxed font-medium ${isListening ? 'text-center' : ''}`}
        />
        <div className="flex items-center justify-between pt-3 border-t border-background mt-2">
          <Button variant="primary" size="sm" disabled={!noteText.trim() || loading || isListening} onClick={onGenerate} className="gap-2 text-xs font-bold">
            <Sparkles size={14} />
            <span>{loading ? (isArabic ? 'جاري الصياغة...' : 'Processing...') : (isArabic ? 'صياغة الإعلان' : 'Generate Listing')}</span>
          </Button>
          <Button variant={isListening ? 'primary' : 'outline'} size="sm" onClick={onVoice} disabled={loading} className="relative gap-2 text-xs font-bold transition-all">
            <Mic size={16} className={isListening ? 'animate-bounce' : ''} />
            <span>{isListening ? (isArabic ? 'جاري الاستماع...' : 'Listening...') : (isArabic ? 'تحدث بالصوت' : 'Voice Mic')}</span>
          </Button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <Button variant="ghost" onClick={onToggleManual} className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-surface border border-border text-ink-soft text-xs font-bold">
          <div className="flex items-center gap-2"><FileText size={16} /> {isArabic ? 'أو أضف التفاصيل يدوياً' : 'Or add details manually'}</div>
          {showManualForm ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
        {showManualForm && (
          <form onSubmit={onManualSubmit} className="mt-3 p-4 rounded-2xl bg-surface border border-border flex flex-col gap-3">
            <Input label={isArabic ? 'العنوان' : 'Title'} required value={manualTitle} onChange={onManualTitleChange} className="h-10 text-xs" />
            <Input label={isArabic ? 'السعر' : 'Price'} type="number" value={manualPrice} onChange={onManualPriceChange} className="h-10 text-xs" />
            <Textarea label={isArabic ? 'الوصف' : 'Description'} rows={3} value={manualDesc} onChange={onManualDescChange} className="text-xs min-h-[80px]" />
            <Button type="submit" variant="primary" fullWidth size="lg"> {isArabic ? 'متابعة' : 'Continue'} </Button>
          </form>
        )}
      </div>
    </div>
  );
};
