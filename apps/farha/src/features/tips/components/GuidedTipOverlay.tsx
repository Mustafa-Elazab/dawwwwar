import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useTheme, spacing } from '@dawwar/theme';
import { AppButton, AppText } from '@dawwar/ui';

interface GuidedTipOverlayProps {
  visible: boolean;
  title: string;
  body: string;
  closeLabel: string;
  onClose: () => void;
}

export function GuidedTipOverlay({
  visible,
  title,
  body,
  closeLabel,
  onClose,
}: GuidedTipOverlayProps) {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        style={styles.backdrop}
        onPress={onClose}
      >
        <View style={styles.tipPosition} pointerEvents="box-none">
          <View style={[styles.pointer, { borderBottomColor: colors.card }]} />
          <Pressable
            style={[styles.bubble, { backgroundColor: colors.card }]}
            onPress={(event) => event.stopPropagation()}
          >
            <AppText variant="h4" align="center" color={colors.text}>
              {title}
            </AppText>
            <AppText variant="body1" align="center" color={colors.textSecondary}>
              {body}
            </AppText>
            <AppButton label={closeLabel} size="sm" onPress={onClose} />
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.48)',
  },
  tipPosition: {
    paddingHorizontal: spacing[4],
    paddingTop: 150,
    alignItems: 'center',
  },
  pointer: {
    width: 0,
    height: 0,
    borderStartWidth: 14,
    borderEndWidth: 14,
    borderBottomWidth: 20,
    borderStartColor: 'transparent',
    borderEndColor: 'transparent',
  },
  bubble: {
    width: '100%',
    maxWidth: 520,
    borderRadius: 24,
    padding: spacing[5],
    gap: spacing[3],
    alignItems: 'center',
  },
});
