import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Icon } from '../../../atoms/Icon';

interface ChatInputProps {
  onSend: (text: string) => void;
  onTyping: () => void;
  onVoiceRecord?: () => void;
  onImageSelect?: () => void;
  placeholder?: string;
  isLoading?: boolean;
}

export function ChatInput({ 
  onSend, 
  onTyping, 
  onVoiceRecord, 
  onImageSelect,
  placeholder = 'Type a message...',
  isLoading 
}: ChatInputProps) {
  const { colors, space, radius } = useTheme();
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={[styles.container, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <View style={styles.actions}>
           <TouchableOpacity onPress={onImageSelect} style={styles.actionButton}>
              <Icon name="camera-outline" size={24} color={colors.primary} />
           </TouchableOpacity>
        </View>

        <View style={[styles.inputWrapper, { backgroundColor: colors.surfaceVariant }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder={placeholder}
            placeholderTextColor={colors.textSecondary}
            value={text}
            onChangeText={(t) => {
              setText(text);
              onTyping();
            }}
            multiline
            maxLength={500}
          />
        </View>

        <View style={styles.sendWrapper}>
          {text.trim() ? (
            <TouchableOpacity 
              onPress={handleSend} 
              style={[styles.sendButton, { backgroundColor: colors.primary }]}
              disabled={isLoading}
            >
              <Icon name="send" size={20} color="#FFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              onPress={onVoiceRecord} 
              style={[styles.sendButton, { backgroundColor: colors.primary }]}
            >
              <Icon name="microphone" size={20} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  actions: {
    marginBottom: 4,
  },
  actionButton: {
    padding: 8,
  },
  inputWrapper: {
    flex: 1,
    borderRadius: 20,
    marginHorizontal: 8,
    paddingHorizontal: 12,
    maxHeight: 100,
    justifyContent: 'center',
  },
  input: {
    fontSize: 15,
    paddingVertical: 8,
    paddingTop: 8, // for multiline alignment
  },
  sendWrapper: {
    marginBottom: 4,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
