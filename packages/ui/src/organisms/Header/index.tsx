import React from 'react';
import { I18nManager, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@dawwar/theme';

import { Text, Icon } from '../../atoms';
import { createStyles } from './styles';
import type { HeaderProps } from './types';

export function Header({
  title,
  subtitle,

  leftAction,
  rightAction,

  leftComponent,
  rightComponent,

  type = 'default',
  onBackPress,

  transparent = false,
  style,
  testID,
}: HeaderProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const navigation = useNavigation();

  const isRTL = I18nManager.isRTL;
  const canGoBack = navigation.canGoBack();

  /**
   * Show default back button
   * ONLY if:
   * - type = default
   * - screen can go back
   * - no custom action/component passed on that side
   */
  const shouldShowBack =
    type === 'default' && canGoBack;

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }

    navigation.goBack();
  };

  const renderAction = (
    action?: HeaderProps['leftAction'],
  ) => {
    if (!action) return null;

    return (
      <TouchableOpacity
        style={[
          styles.actionBtn,
          transparent && styles.actionBtnTransparent,
        ]}
        onPress={action.onPress}
        testID={action.testID}
      >
        <Icon
          name={action.icon}
          size={24}
          color={colors.text}
        />
      </TouchableOpacity>
    );
  };

  const renderBackButton = () => {
    const backIcon = I18nManager.isRTL ? 'chevron-right' : 'chevron-left';
    return (
      <TouchableOpacity
        style={[
          styles.actionBtn,
          transparent && styles.actionBtnTransparent,
        ]}
        onPress={handleBack}
      >
        <Icon
          name={backIcon}
          size={28}
          color={colors.text}
        />
      </TouchableOpacity>
    );
  };

  /**
   * LEFT SIDE (Logical Start)
   */
  const leftNode =
    leftComponent ||
    renderAction(leftAction) ||
    (shouldShowBack ? renderBackButton() : null);

  /**
   * RIGHT SIDE (Logical End)
   */
  const rightNode =
    rightComponent ||
    renderAction(rightAction);

  const hasActions = leftNode || rightNode;

  const hasContent =
    hasActions || title || subtitle;

  if (!hasContent) {
    return null;
  }

  return (
    <View
      style={[
        styles.root,
        transparent && styles.rootTransparent,
        style,
      ]}
      testID={testID}
    >
      {/* Actions */}
      {hasActions && (
        <View style={styles.actionsRow}>
          <View style={styles.sideContainer}>
            {leftNode}
          </View>

          <View style={styles.spacer} />

          <View style={styles.sideContainer}>
            {rightNode}
          </View>
        </View>
      )}

      {/* Title */}
      {(title || subtitle) && (
        <View style={styles.titleContainer}>
          {title && (
            <Text
              style={styles.title}
              numberOfLines={1}
            >
              {title}
            </Text>
          )}

          {subtitle && (
            <Text
              style={styles.subtitle}
              numberOfLines={2}
            >
              {subtitle}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}