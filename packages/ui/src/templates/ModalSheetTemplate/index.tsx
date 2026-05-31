import React from 'react';
import {
  I18nManager,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@dawwar/theme';
import { Icon, Text } from '../../atoms';
import { createStyles } from './styles';
import type { ModalSheetTemplateProps } from './types';

export function ModalSheetTemplate({
  visible,
  title,
  subtitle,
  children,
  footer,
  onClose,
  closeLabel,
  maxHeight = '90%',
  dismissOnBackdropPress = true,
  contentStyle,
  testID,
}: ModalSheetTemplateProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const closeIcon = I18nManager.isRTL ? 'chevron-right' : 'close';

  const handleBackdropPress = () => {
    if (dismissOnBackdropPress) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
      testID={testID}
    >
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable
          style={styles.backdropHitArea}
          onPress={handleBackdropPress}
          accessibilityLabel={closeLabel}
        />
        <SafeAreaView
          edges={['bottom']}
          style={[
            styles.sheet,
            { maxHeight },
          ]}
        >
          <View style={styles.handle} />
          {(title || subtitle) ? (
            <View style={styles.header}>
              <View style={styles.titleBlock}>
                {title ? (
                  <Text variant="h4" numberOfLines={2}>
                    {title}
                  </Text>
                ) : null}
                {subtitle ? (
                  <Text variant="body2" color={colors.textSecondary} numberOfLines={2}>
                    {subtitle}
                  </Text>
                ) : null}
              </View>
              <Pressable
                style={styles.closeButton}
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel={closeLabel}
              >
                <Icon name={closeIcon} size={22} color={colors.text} />
              </Pressable>
            </View>
          ) : null}
          <View style={[styles.content, contentStyle]}>
            {children}
          </View>
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
