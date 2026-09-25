import React from 'react';
import { useUI } from '@/hooks/useUI';
import { useAiCapture } from '../hooks/useAiCapture';
import { ArrowLeft, ArrowRight, Microphone2, Add, CloseCircle } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@iconify/react';

export const AiCaptureScreen: React.FC = () => {
  const { isArabic, goBack } = useUI();
  const {
    images, fileInputRef, handleImageSelect, handleRemoveImage, rawText, setRawText,
    isRecording, recordingTime, handleVoiceToggle, isSupported, errorMsg, isAnalyzing, canSubmit, hasPhoto, hasText, handleGenerate
  } = useAiCapture();
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;
  const triggerUpload = () => fileInputRef.current?.click();

  return (
    <div id="ai-capture-screen" className="flex flex-col min-h-screen bg-surface pb-24" dir={isArabic ? 'rtl' : 'ltr'}>
      <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" multiple className="hidden" />
      <div className="px-4 py-4 border-b border-white/10 flex items-center gap-3 bg-brand sticky top-0 z-20">
        <Button id="ai-capture-back-btn" variant="ghost" size="icon" onClick={goBack} className="w-10 h-10 rounded-full bg-white/15 text-white flex items-center justify-center p-0">
          <BackIcon size={18} variant="Linear" color="#FFFFFF" />
        </Button>
        <Icon icon="fluent-emoji:sparkles" width={20} height={20} />
        <h2 className="text-lg font-bold text-white">{isArabic ? 'باستخدام الذكاء الاصطناعي' : 'AI Listing Builder'}</h2>
      </div>
      <div className="p-4 flex flex-col gap-6 flex-1">
        <div className="bg-surface border border-line rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-ink">{isArabic ? 'صور السلعة (مطلوب)' : 'Item Photos (Required)'}</h3>
            <span className="text-xs text-ink-muted">{images.length}/10</span>
          </div>
          {images.length === 0 ? (
            <div id="ai-capture-empty-photos" onClick={triggerUpload} className="border-2 border-dashed border-line rounded-2xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer bg-canvas/30">
              <div className="w-20 h-20 rounded-full bg-brand/8 flex items-center justify-center mb-2">
                <Icon icon="fluent-emoji:camera" width={44} height={44} />
              </div>
              <p className="text-xs font-bold text-ink">{isArabic ? 'اضغط هنا لرفع الصور' : 'Tap to upload photos'}</p>
              <p className="text-[10px] text-ink-muted">{isArabic ? 'صورة واحدة على الأقل للبدء' : 'At least 1 photo required'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2.5">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-line shrink-0 bg-canvas/50">
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <button onClick={() => handleRemoveImage(idx)} className="absolute top-1 right-1 bg-ink/70 rounded-full p-0.5" aria-label="Remove image">
                    <CloseCircle size={16} variant="Bold" color="#FFFFFF" />
                  </button>
                </div>
              ))}
              {images.length < 10 && (
                <button onClick={triggerUpload} className="w-20 h-20 border-2 border-dashed border-line rounded-xl flex items-center justify-center bg-canvas/25" aria-label="Add image">
                  <Add size={24} variant="Linear" className="text-ink-muted" />
                </button>
              )}
            </div>
          )}
        </div>
        <div className="bg-surface border border-line rounded-2xl p-4 flex flex-col gap-3">
          <h3 className="text-sm font-bold text-ink">{isArabic ? 'وصف السلعة (اكتب أو تكلم)' : 'Description (write or speak)'}</h3>
          <div className={`relative border rounded-xl p-3 bg-canvas/20 transition-all ${isRecording ? 'border-brand ring-2 ring-brand/10' : 'border-line'}`}>
            <textarea rows={5} value={rawText} onChange={(e) => setRawText(e.target.value)} disabled={isAnalyzing || isRecording} placeholder={isRecording ? (isArabic ? 'جاري الاستماع...' : 'Listening...') : (isArabic ? 'اوصف السلعة: الاسم، الموديل، السنة، السعر، الحالة...' : 'Describe: name, model, year, price, condition...')} className="w-full bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none resize-none" />
            {isRecording && (
              <div className="flex items-center gap-2 mt-2 px-3 py-1 rounded-lg bg-brand/10 text-brand text-xs font-bold border border-brand/20 animate-pulse w-max">
                <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
                <span>{isArabic ? `جاري التسجيل: ${recordingTime} ثانية` : `Recording: ${recordingTime}s`}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Button variant={isRecording ? 'primary' : 'outline'} size="sm" onClick={handleVoiceToggle} disabled={isAnalyzing || !isSupported} className="gap-2 font-bold" title={!isSupported ? (isArabic ? 'المتصفح غير مدعوم' : 'Browser not supported') : ''}>
              <Microphone2 size={16} variant="Linear" className={isRecording ? 'animate-bounce' : ''} />
              <span>{isRecording ? (isArabic ? 'إيقاف التسجيل' : 'Stop Recording') : !isSupported ? (isArabic ? 'قيد التجهيز' : 'Coming soon') : (isArabic ? 'تحدث لوصف السلعة' : 'Speak to describe')}</span>
            </Button>
            {errorMsg && <p className="text-[#DC2626] text-xs">{errorMsg}</p>}
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] p-4 bg-surface/95 backdrop-blur-md border-t border-border z-30">
        <Button id="ai-capture-generate-btn" variant="primary" size="lg" onClick={handleGenerate} disabled={!canSubmit || isAnalyzing} className="w-full gap-2 text-sm font-bold py-3.5">
          <Icon
            icon="fluent-emoji:sparkles"
            width={20}
            height={20}
            className={isAnalyzing ? 'animate-spin' : ''}
          />
          <span>{isAnalyzing ? (isArabic ? 'جاري الصياغة والإنشاء...' : 'Analyzing & Generating...') : (isArabic ? 'أنشئ الإعلان' : 'Generate Listing')}</span>
        </Button>
        {!hasPhoto && (
          <p className="text-xs text-ink-muted text-center mt-2">
            {isArabic ? 'أضف صورة واحدة على الأقل' : 'Add at least one photo'}
          </p>
        )}
        {hasPhoto && !hasText && (
          <p className="text-xs text-ink-muted text-center mt-2">
            {isArabic ? 'اكتب وصفاً أو استخدم الصوت' : 'Add a description or use voice'}
          </p>
        )}
      </div>
    </div>
  );
};
