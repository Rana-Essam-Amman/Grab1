import { useUI } from '@/hooks/useUI';
import { usePostWizard } from '../hooks/usePostWizard';
import { useAiDraft } from '../hooks/useAiDraft';
import { useAuth } from '@/hooks/useAuth';
import React, { useEffect, useState } from 'react';
import { AiDraftHeader } from '../components/AiDraftHeader';
import { AiDraftForm } from '../components/AiDraftForm';
import { AiDraftSamples } from '../components/AiDraftSamples';

const QUICK_SAMPLES = [
  { ar: 'تويوتا كامري 2022 فحص 4 جيد', en: 'Toyota Camry 2022 Clean' },
  { ar: 'آيفون 15 برو ماكس 256 تيتانيوم', en: 'iPhone 15 Pro Max 256GB Titanium' },
];

export const AiDraftScreen: React.FC = () => {
  const { isArabic, goBack, navigateTo } = useUI();
  const { authStatus } = useAuth();
  
  // Protect screen behind session guard
  useEffect(() => {
    if (authStatus === 'unauthenticated') navigateTo('login');
  }, [authStatus, navigateTo]);

  const {
    prompt, isGenerating, handleGenerate, handleManualSubmit
  } = useAiDraft();

  // Temporary local state for UI compatibility until hook is fully expanded
  const [noteText, setNoteText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualPrice, setManualPrice] = useState('');
  const [manualDesc, setManualDesc] = useState('');

  const onManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleManualSubmit({ title: manualTitle, price: manualPrice, description: manualDesc });
    navigateTo('post-ai-review');
  };

  if (authStatus === 'unauthenticated') return null;

  return (
    <div className="max-w-[440px] mx-auto w-full flex flex-col min-h-screen bg-surface pb-12 shadow-md" dir={isArabic ? 'rtl' : 'ltr'}>
      <AiDraftHeader isArabic={isArabic} onBack={goBack} />
      <div className="p-4 flex flex-col gap-4 flex-1">
        <AiDraftForm
          isArabic={isArabic}
          noteText={noteText}
          isListening={isListening}
          loading={isGenerating}
          showManualForm={showManualForm}
          manualTitle={manualTitle}
          manualPrice={manualPrice}
          manualDesc={manualDesc}
          onNoteTextChange={setNoteText}
          onGenerate={() => handleGenerate()}
          onVoice={() => setIsListening(!isListening)}
          onToggleManual={() => setShowManualForm(!showManualForm)}
          onManualTitleChange={(e) => setManualTitle(e.target.value)}
          onManualPriceChange={(e) => setManualPrice(e.target.value)}
          onManualDescChange={(e) => setManualDesc(e.target.value)}
          onManualSubmit={onManualSubmit}
        />
        <AiDraftSamples isArabic={isArabic} samples={QUICK_SAMPLES} onSampleClick={(text) => { setNoteText(text); handleGenerate(); }} />
      </div>
    </div>
  );
};



