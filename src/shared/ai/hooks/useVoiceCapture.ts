import { useState, useRef, useCallback, useEffect } from 'react';

// ─── Web Speech API types (not in lib.dom.d.ts) ───
interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}
interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}
interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}
interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const MAX_SECONDS = 90;
const WARN_SECONDS = 60;
const SILENCE_AUTO_STOP_MS = 5000;

export interface UseVoiceCaptureReturn {
  readonly isRecording: boolean;
  readonly recordingTime: number;
  readonly isWarning: boolean;
  readonly interimText: string;
  readonly isSupported: boolean;
  readonly errorMsg: string | null;
  readonly handleVoiceToggle: () => void;
  readonly stopRecording: () => void;
}

export const useVoiceCapture = (
  onTranscript: (text: string) => void,
  marketCode: string,
  isArabic: boolean
): UseVoiceCaptureReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [interimText, setInterimText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const silenceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recRef = useRef<SpeechRecognitionInstance | null>(null);

  const SpeechAPI = typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : undefined;
  const isSupported = Boolean(SpeechAPI);
  const isWarning = isRecording && recordingTime >= WARN_SECONDS;

  const clearSilence = useCallback(() => {
    if (silenceRef.current) { clearTimeout(silenceRef.current); silenceRef.current = null; }
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    setInterimText('');
    clearSilence();
    if (recRef.current) {
      try { recRef.current.stop(); } catch { /* ignore */ }
    }
  }, [clearSilence]);

  const armSilence = useCallback(() => {
    clearSilence();
    silenceRef.current = setTimeout(() => stopRecording(), SILENCE_AUTO_STOP_MS);
  }, [clearSilence, stopRecording]);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= MAX_SECONDS) { stopRecording(); return 0; }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingTime(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      clearSilence();
    };
  }, [isRecording, stopRecording, clearSilence]);

  const handleVoiceToggle = useCallback(() => {
    setErrorMsg(null);
    if (isRecording) { stopRecording(); return; }

    if (!SpeechAPI) {
      setErrorMsg(isArabic ? 'المتصفح لا يدعم التعرف على الصوت' : 'Speech recognition not supported');
      return;
    }

    try {
      const rec = new SpeechAPI();
      rec.continuous = true;
      rec.interimResults = true;
      rec.maxAlternatives = 1;
      rec.lang = `ar-${marketCode}`;

      rec.onresult = (e: SpeechRecognitionEvent) => {
        let finalChunk = '';
        let interim = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const result = e.results[i];
          const transcript = result[0].transcript;
          if (result.isFinal) finalChunk += transcript;
          else interim += transcript;
        }
        if (finalChunk.trim()) onTranscript(finalChunk.trim());
        setInterimText(interim);
        armSilence();
      };

      rec.onerror = (e: SpeechRecognitionErrorEvent) => {
        setErrorMsg(isArabic ? `خطأ في الصوت: ${e.error}` : `Voice error: ${e.error}`);
        setIsRecording(false);
        setInterimText('');
        clearSilence();
      };

      rec.onend = () => {
        setIsRecording(false);
        setInterimText('');
        clearSilence();
      };

      recRef.current = rec;
      rec.start();
      setIsRecording(true);
      armSilence();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(isArabic ? `تعذر بدء التسجيل: ${msg}` : `Could not start: ${msg}`);
      setIsRecording(false);
    }
  }, [isRecording, stopRecording, SpeechAPI, marketCode, isArabic, onTranscript, armSilence, clearSilence]);

  return {
    isRecording,
    recordingTime,
    isWarning,
    interimText,
    isSupported,
    errorMsg,
    handleVoiceToggle,
    stopRecording,
  };
};
