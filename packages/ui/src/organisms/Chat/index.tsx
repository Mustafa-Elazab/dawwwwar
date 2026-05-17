import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { useChat, MessageType } from '@dawwar/api-client';
import { ChatMessagesList } from './components/ChatMessagesList';
import { ChatInput } from './components/ChatInput';
import { Text } from '../../atoms/Text';
import { User } from '@dawwar/types';

interface ChatInterfaceProps {
  orderId: string;
  currentUser: User | null;
  onImagePress?: (url: string) => void;
  onVoiceRecord?: () => void;
  onImageSelect?: () => void;
}

export function ChatInterface({ 
  orderId, 
  currentUser,
  onImagePress,
  onVoiceRecord,
  onImageSelect 
}: ChatInterfaceProps) {
  const { colors, space } = useTheme();
  const { 
    messages, 
    isLoading, 
    isTyping, 
    sendMessage, 
    handleInputChange 
  } = useChat(orderId, currentUser);

  return (
    <View style={styles.container}>
      <ChatMessagesList 
        messages={messages} 
        userId={currentUser?.id || ''} 
        isLoading={isLoading}
        onImagePress={onImagePress}
      />
      
      {isTyping && (
        <View style={styles.typingContainer}>
           <Text variant="caption" color={colors.textSecondary}>Someone is typing...</Text>
        </View>
      )}

      <ChatInput 
        onSend={(text) => sendMessage(text, MessageType.TEXT)}
        onTyping={handleInputChange}
        onVoiceRecord={onVoiceRecord}
        onImageSelect={onImageSelect}
        isLoading={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  typingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  }
});
