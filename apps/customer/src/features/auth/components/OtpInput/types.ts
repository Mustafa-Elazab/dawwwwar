export interface OtpInputProps {
  value: string;               // single string for the full code
  onChange?: (code: string) => void;
  hasError?: boolean;
  testID?: string;
}
