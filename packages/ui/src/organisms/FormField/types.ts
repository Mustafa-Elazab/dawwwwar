import type { Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import type { KeyboardTypeOptions } from 'react-native';

export interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  rules?: RegisterOptions<T, Path<T>>;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  numberOfLines?: number;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  hint?: string;
  editable?: boolean;
  autoFocus?: boolean;
}
