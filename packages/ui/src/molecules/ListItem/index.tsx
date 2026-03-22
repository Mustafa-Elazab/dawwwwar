import React from 'react';
import { TouchableOpacity, View, I18nManager } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text, Icon } from '../../atoms';
import { createStyles } from './styles';
import type { ListItemProps } from './types';

export function ListItem({
  title,
  subtitle,
  leftElement,
  rightElement,
  onPress,
  disabled = false,
  showChevron = false,
  style,
  testID,
}: ListItemProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      style={[styles.container, disabled && styles.disabled, style] as any}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
      testID={testID}
    >
      {leftElement && <View style={styles.left}>{leftElement}</View>}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {rightElement && <View style={styles.right}>{rightElement}</View>}
      {showChevron && !rightElement && (
        <Icon
          name={I18nManager.isRTL ? 'chevron-left' : 'chevron-right'}
          size={20}
          color={colors.textDisabled}
        />
      )}
    </Wrapper>
  );
}
