import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme, radius, spacing } from '@dawwar/theme';
import { AppPressable, AppText } from '../../atoms';

export interface SegmentedControlItem {
  key: string;
  label: string;
  accessibilityLabel?: string;
}

export interface SegmentedControlProps {
  items: SegmentedControlItem[];
  activeKey: string;
  onChange: (key: string) => void;
}

export function SegmentedControl({ items, activeKey, onChange }: SegmentedControlProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: colors.surfaceVariant }]}>
      {items.map((item) => {
        const active = item.key === activeKey;
        return (
          <AppPressable
            key={item.key}
            accessibilityRole="button"
            accessibilityState={active ? { selected: true } : undefined}
            accessibilityLabel={item.accessibilityLabel ?? item.label}
            onPress={() => onChange(item.key)}
            style={[styles.item, { backgroundColor: active ? colors.primary : 'transparent' }]}
          >
            <AppText
              variant="label"
              color={active ? colors.primaryText : colors.textSecondary}
              align="center"
              numberOfLines={1}
            >
              {item.label}
            </AppText>
          </AppPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    borderRadius: radius.full,
    padding: spacing[1],
    gap: spacing[1],
  },
  item: {
    flex: 1,
    minHeight: 38,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingStart: spacing[2],
    paddingEnd: spacing[2],
  },
});
