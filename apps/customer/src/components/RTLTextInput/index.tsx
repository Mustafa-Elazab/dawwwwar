import React from 'react';
import { TextInput, TextInputProps, I18nManager } from 'react-native';

const RTLTextInput = (props: TextInputProps) => {
  const isRTL = I18nManager.isRTL;
  return (
    <TextInput
      {...props}
      textAlign={isRTL ? 'right' : 'left'}
      style={[
        props.style,
        { textAlignVertical: 'center' }
      ]}
    />
  );
};

export default RTLTextInput;
