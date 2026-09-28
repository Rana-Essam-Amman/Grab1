import { useState, useRef, useCallback, useEffect } from 'react';
import {
  VOICE_MAX_SECONDS,
  VOICE_WARN_SECONDS,
  VOICE_SILENCE_AUTO_STOP_MS,
  type UseVoiceCaptureReturn,
} from './voiceCapture.config';
import type {
  SpeechRecognitionEvent,
  SpeechRecognitionErrorEvent,
  SpeechRecognitionInstance,
} from './speechRecognition.types';

export type { UseVoiceCaptureReturn } from './voiceCapture.config';

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

  const SpeechAPI = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : undefined;
  const isSupported = Boolean(SpeechAPI);
  const isWarning = isRecording && recordingTime >= VOICE_WARN_SECONDS;

  const clearSilence = useCallback(() => {
    if (silenceRef.current) { clearTimeout(silenceRef.current); silenceRef.current = null; }
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false); setInterimText(''); clearSilence();
    if (recRef.current) { try { recRef.current.stop(); } catch { /* ignore */ } }
  }, [clearSilence]);

  const armSilence = useCallback(() => {
    clearSilence();
    silenceRef.current = setTimeout(() => stopRecording(), VOICE_SILENCE_AUTO_STOP_MS);
  }, [clearSilence, stopRecording]);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev >= VOICE_MAX_SECONDS ? (stopRecording(), 0) : prev + 1);
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
      rec.continuous = true; rec.interimResults = true; rec.maxAlternatives = 1; rec.lang = `ar-${marketCode}`;
      rec.onresult = (e: SpeechRecognitionEvent) => {
        let finalChunk = '', interim = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const res = e.results[i];
          if (res.isFinal) finalChunk += res[0].transcript;
          else interim += res[0].transcript;
        }
        if (finalChunk.trim()) onTranscript(finalChunk.trim());
        setInterimText(interim); armSilence();
      };
      rec.onerror = (e: SpeechRecognitionErrorEvent) => {
        setErrorMsg(isArabic ? `خطأ في الصوت: ${e.error}` : `Voice error: ${e.error}`);
        setIsRecording(false); setInterimText(''); clearSilence();
      };
      rec.onend = () => { setIsRecording(false); setInterimText(''); clearSilence(); };
      recRef.current = rec; rec.start(); setIsRecording(true); armSilence();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(isArabic ? `تعذر بدء التسجيل: ${msg}` : `Could not start: ${msg}`);
      setIsRecording(false);
    }
  }, [isRecording, stopRecording, SpeechAPI, marketCode, isArabic, onTranscript, armSilence, clearSilence]);

  return { isRecording, recordingTime, isWarning, interimText, isSupported, errorMsg, handleVoiceToggle, stopRecording };
};
