/// Voice goes into the same note field.
/// When an AI/speech subscription exists, assign [transcribeVoice].
typedef VoiceTranscriber = Future<String?> Function();

VoiceTranscriber? transcribeVoice;

Future<String?> captureVoiceNote() async {
  if (transcribeVoice == null) return null;
  return transcribeVoice!();
}
