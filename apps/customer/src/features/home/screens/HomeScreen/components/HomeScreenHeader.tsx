import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { Icon, Text } from '@dawwar/ui';
import { createStyles } from '../styles';

interface HomeScreenHeaderProps {
  colors: AppColors;
  deliverToLabel: string;
  locationText: string;
  notificationBadgeVisible?: boolean;
  onLocationPress: () => void;
  onNotificationsPress: () => void;
}

export function HomeScreenHeader({
  colors,
  deliverToLabel,
  locationText,
  notificationBadgeVisible = true,
  onLocationPress,
  onNotificationsPress,
}: HomeScreenHeaderProps) {
  const styles = createStyles(colors);

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerTopRow}>
        <TouchableOpacity
          style={styles.locationBlock}
          onPress={onLocationPress}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.deliveringLabel}>{deliverToLabel}</Text>
          <View style={styles.locationRow}>
            <Text style={styles.locationPrimary} numberOfLines={1}>
              {locationText}
            </Text>
            <Icon name="menu-down" size={22} color={colors.primary} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bagBtn} onPress={onNotificationsPress}>
          <Icon name="bell-outline" size={24} color={colors.text} />
          {notificationBadgeVisible ? <View style={styles.badgeDot} /> : null}
        </TouchableOpacity>
      </View>
    </View>
  );
}
