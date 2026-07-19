import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text } from '../../../atoms/Text';
import { ChatMessage, MessageType } from '@dawwar/api-client';
import dayjs from 'dayjs';
import { Icon } from '../../../atoms/Icon';

interface MessageBubbleProps {
  message: Partial<ChatMessage> & { isOptimistic?: boolean; status?: string };
  isMe: boolean;
  onImagePress?: (url: string) => void;
}

export function MessageBubble({ message, isMe, onImagePress }: MessageBubbleProps) {
  const { colors, space, radius, typography } = useTheme();

  const isSystem = message.type === MessageType.SYSTEM_EVENT;
  
  if (isSystem) {
    return (
      <View style={styles.systemContainer}>
        <View style={[styles.systemBadge, { backgroundColor: colors.surfaceVariant }]}>
          <Text variant="caption" color={colors.textSecondary}>{message.content}</Text>
        </View>
      </View>
    );
  }

  const renderContent = () => {
    switch (message.type) {
      case MessageType.IMAGE:
        return (
          <TouchableOpacity onPress={() => message.mediaUrl && onImagePress?.(message.mediaUrl)}>
            <Image 
              source={{ uri: message.mediaUrl }} 
              style={styles.image} 
              resizeMode="cover"
            />
          </TouchableOpacity>
        );
      case MessageType.VOICE:
        return (
          <View style={styles.voiceRow}>
            <Icon name="play-circle" size={24} color={isMe ? '#FFF' : colors.primary} />
            <View style={styles.voiceWaveform}>
               <View style={[styles.waveformBar, { height: 12, backgroundColor: isMe ? 'rgba(255,255,255,0.4)' : colors.border }]} />
               <View style={[styles.waveformBar, { height: 18, backgroundColor: isMe ? 'rgba(255,255,255,0.4)' : colors.border }]} />
               <View style={[styles.waveformBar, { height: 14, backgroundColor: isMe ? 'rgba(255,255,255,0.4)' : colors.border }]} />
               <View style={[styles.waveformBar, { height: 20, backgroundColor: isMe ? 'rgba(255,255,255,0.4)' : colors.border }]} />
            </View>
            <Text variant="caption" color={isMe ? '#FFF' : colors.textSecondary}>0:12</Text>
          </View>
        );
      default:
        return (
          <Text 
            style={[
              typography.body2, 
              { color: isMe ? '#FFF' : colors.text }
            ]}
          >
            {message.content}
          </Text>
        );
    }
  };

  return (
    <View style={[styles.bubbleContainer, isMe ? styles.myBubbleContainer : styles.theirBubbleContainer]}>
      <View 
        style={[
          styles.bubble, 
          { 
            backgroundColor: isMe ? colors.primary : colors.card,
            borderBottomRightRadius: isMe ? 4 : radius.lg,
            borderBottomLeftRadius: isMe ? radius.lg : 4,
          },
          !isMe && styles.shadow
        ]}
      >
        {renderContent()}
        
        <View style={styles.footer}>
          <Text style={[styles.time, { color: isMe ? 'rgba(255,255,255,0.7)' : colors.textSecondary }]}>
            {dayjs(message.createdAt).format('HH:mm')}
          </Text>
          {isMe && (
            <View style={styles.statusIcon}>
              <Icon 
                name={message.isOptimistic ? 'clock-outline' : 'check-all'} 
                size={12} 
                color="rgba(255,255,255,0.7)" 
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bubbleContainer: {
    marginVertical: 4,
    flexDirection: 'row',
    width: '100%',
  },
  myBubbleContainer: {
    justifyContent: 'flex-end',
    paddingStart: 40,
  },
  theirBubbleContainer: {
    justifyContent: 'flex-start',
    paddingEnd: 40,
  },
  bubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    maxWidth: '100%',
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  time: {
    fontSize: 10,
  },
  statusIcon: {
    marginStart: 4,
  },
  systemContainer: {
    alignItems: 'center',
    marginVertical: 12,
    width: '100%',
  },
  systemBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  image: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 4,
  },
  voiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 120,
  },
  voiceWaveform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flex: 1,
  },
  waveformBar: {
    width: 3,
    borderRadius: 1,
  }
});
