import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text, Icon } from '../../atoms';
import { createStyles } from './styles';
import type { HeaderProps } from './types';

export function Header({
  title,
  leftAction,
  rightAction,
  transparent = false,
  style,
  testID,
}: HeaderProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors, transparent);

  return (
    <View style={[styles.container, style]} testID={testID}>
      {leftAction ? (
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={leftAction.onPress}
          testID={leftAction.testID}
        >
          <Icon name={leftAction.icon} size={24} color={colors.text} />
        </TouchableOpacity>
      ) : (
        <View style={styles.actionBtn} />
      )}

      <View style={styles.titleContainer}>
        {title && <Text style={styles.title} numberOfLines={1}>{title}</Text>}
      </View>

      {rightAction ? (
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={rightAction.onPress}
          testID={rightAction.testID}
        >
          <Icon name={rightAction.icon} size={24} color={colors.text} />
        </TouchableOpacity>
      ) : (
        <View style={styles.actionBtn} />
      )}
    </View>
  );
}
