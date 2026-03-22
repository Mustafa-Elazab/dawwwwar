export interface OtpInputProps {
  value: string[];            // array of 6 single chars
  onChange: (index: number, char: string) => void;
  onBackspace: (index: number) => void;
  hasError: boolean;
  testID?: string;
}
