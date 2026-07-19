import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTheme, radius, spacing } from '@dawwar/theme';
import { AppPressable, AppText } from '../../atoms';

export interface TabItem {
  key: string;
  label: string;
}

export interface TabsProps {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
}

export function Tabs({ items, activeKey, onChange }: TabsProps) {
  const { colors } = useTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {items.map((item) => {
        const active = item.key === activeKey;
        return (
          <AppPressable
            key={item.key}
            onPress={() => onChange(item.key)}
            style={[
              styles.tab,
              { backgroundColor: active ? colors.primary : colors.surfaceVariant },
            ]}
          >
            <AppText
              variant="label"
              color={active ? colors.primaryText : colors.textSecondary}
              numberOfLines={1}
            >
              {item.label}
            </AppText>
          </AppPressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing[2],
    paddingStart: spacing[4],
    paddingEnd: spacing[4],
  },
  tab: {
    minHeight: 42,
    borderRadius: radius.full,
    paddingStart: spacing[4],
    paddingEnd: spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
