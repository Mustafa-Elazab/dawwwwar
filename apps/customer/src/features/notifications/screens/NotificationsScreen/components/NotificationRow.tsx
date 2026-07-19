import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { Icon, Text } from '@dawwar/ui';
import { createStyles } from '../styles';
import type { NotificationListItem } from '../useController';

interface NotificationRowProps {
  item: NotificationListItem;
  colors: AppColors;
  onPress: (id: string) => void;
}

export function NotificationRow({ item, colors, onPress }: NotificationRowProps) {
  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      style={[styles.row, item.isRead ? styles.rowRead : styles.rowUnread]}
      onPress={() => onPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text
            variant="label"
            style={[styles.title, item.isRead ? styles.titleRead : styles.titleUnread]}
          >
            {item.title}
          </Text>
          {!item.isRead ? <View style={styles.unreadDot} /> : null}
        </View>
        <Text variant="body2" style={styles.body}>
          {item.body}
        </Text>
        <Text variant="caption" style={styles.time}>
          {item.relativeTime}
        </Text>
      </View>
      <View style={styles.iconContainer}>
        <Icon name={item.iconName} size={24} color={item.iconColor} />
      </View>
    </TouchableOpacity>
  );
}
