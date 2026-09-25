import { useState, useRef, useCallback, useEffect } from 'react';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => any;
    webkitSpeechRecognition?: new () => any;
  }
}

export interface UseVoiceCaptureReturn {
  isRecording: boolean;
  recordingTime: number;
  handleVoiceToggle: () => void;
  stopRecording: () => void;
  isSupported: boolean;
  errorMsg: string | null;
}

export const useVoiceCapture = (
  onTranscript: (text: string) => void,
  isArabic: boolean
): UseVoiceCaptureReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recRef = useRef<any | null>(null);

  const SpeechAPI = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : undefined;
  const isSupported = Boolean(SpeechAPI);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    if (recRef.current) {
      try { recRef.current.stop(); } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 60) { stopRecording(); return 0; }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingTime(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording, stopRecording]);

  const handleVoiceToggle = useCallback(() => {
    setErrorMsg(null);
    if (isRecording) { stopRecording(); return; }
    if (!SpeechAPI) {
      setErrorMsg(isArabic ? 'المتصفح غير مدعوم للصوت' : 'Speech recognition not supported');
      return;
    }
    try {
      const rec = new SpeechAPI();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = isArabic ? 'ar-SA' : 'en-US';
      rec.onresult = (e: SpeechRecognitionEvent) => {
        let t = '';
        for (let i = e.results.length - 1; i < e.results.length; i++) { t += e.results[i][0].transcript; }
        if (t.trim()) onTranscript(t.trim());
      };
      rec.onerror = (e: { error: string }) => {
        setErrorMsg(isArabic ? `خطأ في الصوت: ${e.error}` : `Voice error: ${e.error}`);
        setIsRecording(false);
      };
      rec.onend = () => setIsRecording(false);
      recRef.current = rec;
      rec.start();
      setIsRecording(true);
    } catch (err: unknown) {
      setErrorMsg(isArabic ? 'تعذر بدء التسجيل' : `Could not start: ${err instanceof Error ? err.message : String(err)}`);
      setIsRecording(false);
    }
  }, [isRecording, stopRecording, SpeechAPI, isArabic, onTranscript]);

  return { isRecording, recordingTime, handleVoiceToggle, stopRecording, isSupported, errorMsg };
};
