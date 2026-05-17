import React from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text } from '../../../atoms/Text';
import { MessageBubble } from './MessageBubble';
import { ChatMessage } from '@dawwar/api-client';

interface ChatMessagesListProps {
  messages: Partial<ChatMessage>[];
  userId: string;
  isLoading?: boolean;
  onImagePress?: (url: string) => void;
}

export function ChatMessagesList({ messages, userId, isLoading, onImagePress }: ChatMessagesListProps) {
  const { colors, space } = useTheme();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={messages}
      keyExtractor={(item, index) => item.id || item.clientMessageId || index.toString()}
      renderItem={({ item }) => (
        <MessageBubble 
          message={item} 
          isMe={item.senderId === userId} 
          onImagePress={onImagePress}
        />
      )}
      contentContainerStyle={styles.listContent}
      inverted // Messages from bottom to top
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  }
});
