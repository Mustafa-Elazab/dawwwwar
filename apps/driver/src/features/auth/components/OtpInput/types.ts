export interface OtpInputProps {
  value: string;
  length?: number;
  onChange?: (code: string) => void;
  hasError?: boolean;
  testID?: string;
}
