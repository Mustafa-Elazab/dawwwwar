import React from 'react';
import { Controller, type FieldValues } from 'react-hook-form';
import { Input } from '../../atoms/Input/index';
import type { FormFieldProps } from './types';

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  rules,
  secureTextEntry,
  keyboardType,
  multiline,
  numberOfLines,
  leftIcon,
  rightIcon,
  hint,
  editable,
  autoFocus,
}: FormFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <Input
          label={label}
          value={value as string}
          onChangeText={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          error={error?.message}
          hint={hint}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          editable={editable}
          autoFocus={autoFocus}
        />
      )}
    />
  );
}
