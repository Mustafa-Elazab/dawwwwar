import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, radius, spacing } from '@dawwar/theme';
import { AppButton, AppText } from '../../atoms';

export interface FloatingCartCTAProps {
  label: string;
  total?: string;
  count?: number;
  onPress: () => void;
}

export function FloatingCartCTA({ label, total, count, onPress }: FloatingCartCTAProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, spacing[4]) }]}
    >
      <View style={[styles.bar, { backgroundColor: colors.primary }]}>
        {typeof count === 'number' ? (
          <View style={[styles.count, { backgroundColor: colors.primaryMuted }]}>
            <AppText variant="label" color={colors.primaryText} align="center">{String(count)}</AppText>
          </View>
        ) : null}
        <AppButton
          label={total ? `${label} · ${total}` : label}
          onPress={onPress}
          fullWidth
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    start: spacing[4],
    end: spacing[4],
    bottom: 0,
  },
  bar: {
    minHeight: 64,
    borderRadius: radius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[2],
  },
  count: {
    minWidth: 42,
    height: 42,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flex: 1,
  },
});
