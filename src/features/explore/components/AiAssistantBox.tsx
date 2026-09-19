import React, { useEffect } from 'react';
import { useUI } from '@/hooks/useUI';
import { useAiFocus } from '../hooks/useAiFocus';
import { useAiQuota } from '../hooks/useAiQuota';
import { useImageUpload } from '../hooks/useImageUpload';
import { useVoiceCapture } from '../hooks/useVoiceCapture';
import { useAiAssistant } from '../hooks/useAiAssistant';
import { AiQuotaBadge } from './AiQuotaBadge';
import { AiInputTextarea } from './AiInputTextarea';
import { AiThumbnailStrip } from './AiThumbnailStrip';
import { AiSearchFallback } from './AiSearchFallback';
import { AiAssistantControls } from './AiAssistantControls';
import { AiResponseCard } from './AiResponseCard';
import { AiShareDrawer } from './AiShareDrawer';
import { AiAssistantOverlay } from './AiAssistantOverlay';

export interface AiAssistantBoxProps {
  setMaxPriceFilter: (val: number | null) => void; setActiveNeighborhood: (val: string | null) => void;
  setActiveSearchText: (val: string) => void; setVoidedNotice: (val: string | null) => void;
}
export const AiAssistantBox: React.FC<AiAssistantBoxProps> = (props) => {
  const { isArabic, setIsAiFocused, setSearchQuery } = useUI();
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const { isFocused, handleFocus, handleBlur } = useAiFocus();
  const { quota, shareModalOpen: isShareModalOpen, setShareModalOpen: setIsShareModalOpen, handleShareUnlock, consumeQuota: deductCredit } = useAiQuota();
  const { selectedImages: images, fileInputRef, handleImageSelect, handleRemoveImage, clearImages } = useImageUpload();
  const handleRewardClaim = () => {
    handleShareUnlock();
    setToastMessage(isArabic ? '🎉 مبروك! تمت إضافة ٥ محاولات ذكية إضافية لحسابك مجاناً!' : '🎉 Congrats! 5 additional smart attempts unlocked for free!');
    setTimeout(() => setToastMessage(null), 4500);
  };
  const { query, setQuery, handleQueryChange, isAnalyzing, aiResponse, handleSend, clearResponse } = useAiAssistant(props);
  const { isRecording, recordingTime, handleVoiceToggle } = useVoiceCapture((t) => setQuery(t), isArabic);
  useEffect(() => {
    setIsAiFocused(isFocused);
    return () => setIsAiFocused(false);
  }, [isFocused, setIsAiFocused]);
  const onUnifiedSend = () => {
    if (quota <= 0) { setIsShareModalOpen(true); return; }
    if (!query.trim() && images.length === 0) return;
    deductCredit();
    handleSend(images, () => clearImages());
  };
  return (
    <>
      <AiAssistantOverlay toastMessage={toastMessage} isFocused={isFocused} handleBlur={handleBlur} />
      {quota > 0 ? (
        <div
          className={`w-full max-w-[440px] bg-surface rounded-2xl border border-line shadow-xs relative transition-all duration-300 p-3 mb-3 font-cairo ${
            isFocused ? 'ring-2 ring-primary/25 scale-[1.01] z-[10000] border-primary' : 'z-20'
          }`}
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          <AiThumbnailStrip images={images} onRemove={handleRemoveImage} />
          <AiInputTextarea
            value={query}
            onChange={handleQueryChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onSend={onUnifiedSend}
            disabled={isAnalyzing}
            isArabic={isArabic}
            placeholderOverride={
              isAnalyzing ? (isArabic ? 'جاري التحليل...' : 'Analyzing...') : undefined
            }
          />
          <AiAssistantControls
            quota={quota}
            isRecording={isRecording}
            recordingTime={recordingTime}
            canSend={!!query.trim() || images.length > 0}
            disabled={isAnalyzing}
            isArabic={isArabic}
            imageCount={images.length}
            onOpenShareModal={() => setIsShareModalOpen(true)}
            onCameraClick={(e) => { e.preventDefault(); fileInputRef.current?.click(); }}
            onMicToggle={(e) => { e.preventDefault(); handleVoiceToggle(); }}
            onSend={onUnifiedSend}
          />
          <AiResponseCard response={aiResponse} onDismiss={clearResponse} isArabic={isArabic} />
        </div>
      ) : (
        <AiSearchFallback
          isOpen={true}
          onClose={() => {}}
          onSubmit={(val) => {
            setSearchQuery(val);
            props.setActiveSearchText(val);
          }}
          isArabic={isArabic}
        />
      )}
      {quota <= 0 && (
        <div className="w-full max-w-[440px] mx-auto animate-in fade-in slide-in-from-top-1 duration-200 font-cairo">
          <AiQuotaBadge quota={0} onOpenShareModal={() => setIsShareModalOpen(true)} isArabic={isArabic} />
        </div>
      )}
      <AiShareDrawer
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onRewardClaim={handleRewardClaim}
        isArabic={isArabic}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg, image/png, image/webp"
        multiple
        hidden
        onChange={handleImageSelect}
      />
    </>
  );
};
