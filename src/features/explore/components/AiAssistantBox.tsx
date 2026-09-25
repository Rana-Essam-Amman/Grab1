import React, { useEffect } from 'react';
import { useUI } from '@/hooks/useUI';
import { useAiFocus } from '../hooks/useAiFocus';
import { useAiQuota } from '../hooks/useAiQuota';
import { useImageUpload } from '../hooks/useImageUpload';
import { useVoiceCapture } from '../hooks/useVoiceCapture';
import { useAiAssistant } from '../hooks/useAiAssistant';
import { AiQuotaBadge } from './AiQuotaBadge';
import { AiSearchFallback } from './AiSearchFallback';
import { AiShareDrawer } from './AiShareDrawer';
import { AiAssistantContent } from './AiAssistantContent';

export interface AiAssistantBoxProps {
  setMaxPriceFilter: (val: number | null) => void;
  setActiveNeighborhood: (val: string | null) => void;
  setActiveSearchText: (val: string) => void;
  setVoidedNotice: (val: string | null) => void;
}

export const AiAssistantBox: React.FC<AiAssistantBoxProps> = (props) => {
  const { isArabic, setIsAiFocused, setSearchQuery } = useUI();
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const { isFocused, handleFocus, handleBlur } = useAiFocus();
  const { quota, shareModalOpen: isShareModalOpen, setShareModalOpen: setIsShareModalOpen, handleShareUnlock, consumeQuota: deductCredit } = useAiQuota();
  const { selectedImages: images, fileInputRef, handleImageSelect, handleRemoveImage, clearImages } = useImageUpload();

  const handleRewardClaim = () => {
    handleShareUnlock();
    setToastMessage(isArabic ? 'مبروك! تمت إضافة ٥ محاولات ذكية إضافية لحسابك مجاناً!' : 'Congrats! 5 additional smart attempts unlocked for free!');
    setTimeout(() => setToastMessage(null), 4500);
  };

  const { query, setQuery, handleQueryChange, isAnalyzing, handleSend, suggestion, handleSuggestionAccept, handleSuggestionDismiss, hint } = useAiAssistant(props);
  const { isRecording, recordingTime, handleVoiceToggle } = useVoiceCapture((t) => setQuery(t), isArabic);

  useEffect(() => {
    setIsAiFocused(isFocused);
    return () => setIsAiFocused(false);
  }, [isFocused, setIsAiFocused]);

  const onUnifiedSend = () => {
    if (!query.trim() && images.length === 0) return;
    handleSend(images, () => clearImages());
  };

  const onSuggestionAccept = () => {
    if (quota <= 0) { setIsShareModalOpen(true); return; }
    deductCredit();
    handleSuggestionAccept(images);
  };

  return (
    <>
      {toastMessage && (
        <div className="fixed top-4 left-4 right-4 z-[100] max-w-[408px] mx-auto bg-emerald-600 text-white p-3 rounded-2xl shadow-lg flex items-center justify-center text-xs font-bold font-cairo animate-in fade-in slide-in-from-top-2">
          {toastMessage}
        </div>
      )}
      {quota > 0 ? (
        <AiAssistantContent
          isArabic={isArabic} isFocused={isFocused} query={query}
          onQueryChange={handleQueryChange} onFocus={handleFocus} onBlur={handleBlur}
          onSend={onUnifiedSend} isAnalyzing={isAnalyzing} images={images}
          onRemoveImage={handleRemoveImage} quota={quota} isRecording={isRecording}
          recordingTime={recordingTime} onOpenShareModal={() => setIsShareModalOpen(true)}
          onCameraClick={(e) => { e.preventDefault(); fileInputRef.current?.click(); }}
          onMicToggle={(e) => { e.preventDefault(); handleVoiceToggle(); }}
          suggestion={suggestion}
          onSuggestionAccept={onSuggestionAccept}
          onSuggestionDismiss={handleSuggestionDismiss}
          hint={hint}
        />
      ) : (
        <AiSearchFallback
          isOpen={true} onClose={() => {}}
          onSubmit={(val) => { setSearchQuery(val); props.setActiveSearchText(val); }}
          isArabic={isArabic}
        />
      )}
      {quota <= 0 && (
        <div className="w-full max-w-[440px] mx-auto animate-in fade-in slide-in-from-top-1 duration-200 font-cairo">
          <AiQuotaBadge quota={0} onOpenShareModal={() => setIsShareModalOpen(true)} isArabic={isArabic} />
        </div>
      )}
      <AiShareDrawer isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} onRewardClaim={handleRewardClaim} isArabic={isArabic} />
      <input ref={fileInputRef} type="file" accept="image/jpeg, image/png, image/webp" multiple hidden onChange={handleImageSelect} />
    </>
  );
};
