import React from 'react';
import { I18nManager, TextInput, type TextInputProps } from 'react-native';

export default function RTLTextInput(props: TextInputProps) {
  const isRTL = I18nManager.isRTL;

  return (
    <TextInput
      {...props}
      textAlign={isRTL ? 'right' : 'left'}
      style={[
        { textAlignVertical: 'center', writingDirection: isRTL ? 'rtl' : 'ltr' },
        props.style,
      ]}
    />
  );
}
