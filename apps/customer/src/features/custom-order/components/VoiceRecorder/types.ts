export interface VoiceRecorderProps {
  uri: string | null;
  onRecorded: (uri: string, durationSeconds: number) => void;
  onClear: () => void;
}
