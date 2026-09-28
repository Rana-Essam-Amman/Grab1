export const VOICE_MAX_SECONDS = 90;
export const VOICE_WARN_SECONDS = 60;
export const VOICE_SILENCE_AUTO_STOP_MS = 5000;

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
