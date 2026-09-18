import { useState, useRef, useCallback, useEffect } from 'react';

export interface UseVoiceCaptureReturn {
  isRecording: boolean;
  recordingTime: number;
  handleVoiceToggle: () => void;
  stopRecording: () => void;
}

export const useVoiceCapture = (onTranscript: (text: string) => void, isArabic: boolean): UseVoiceCaptureReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const applyVoiceTranscript = useCallback(() => {
    const voiceSamples = isArabic
      ? [
          'تويوتا كامري 2022 فحص كامل ماشية 35 ألف السعر 21500 دينار',
          'آيفون 15 برو ماكس 256 تيتانيوم بحالة جديدة',
          'شقة مفروشة للبيع في عمان الدوار السابع بسعر 85 ألف',
        ]
      : [
          'Toyota Camry 2022 clean 35k km in Amman price 21500 JOD',
          'iPhone 15 Pro Max 256GB Titanium mint condition',
          'Furnished apartment for sale in Amman 7th circle price 85000',
        ];
    const chosen = voiceSamples[Math.floor(Math.random() * voiceSamples.length)];
    onTranscript(chosen);
  }, [isArabic, onTranscript]);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // ignore
      }
    }
    applyVoiceTranscript();
  }, [applyVoiceTranscript]);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 25) {
            stopRecording();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingTime(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, stopRecording]);

  const handleVoiceToggle = useCallback(async () => {
    if (isRecording) {
      stopRecording();
      return;
    }

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setIsRecording(true);

        mediaRecorder.onstop = () => {
          stream.getTracks().forEach((track) => track.stop());
        };
      } else {
        setIsRecording(true);
      }
    } catch {
      setIsRecording(true);
    }
  }, [isRecording, stopRecording]);

  return {
    isRecording,
    recordingTime,
    handleVoiceToggle,
    stopRecording,
  };
};
