import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text } from '@dawwar/ui';
import { space } from '@dawwar/theme';
import { useTranslation } from '@dawwar/i18n';

export type MerchantTab = 'menu' | 'info' | 'reviews';

interface TabBarProps {
  active: MerchantTab;
  onChange: (tab: MerchantTab) => void;
}

const TABS: { key: MerchantTab; labelKey: string }[] = [
  { key: 'menu', labelKey: 'merchant.tab_menu' },
  { key: 'info', labelKey: 'merchant.tab_info' },
  { key: 'reviews', labelKey: 'merchant.tab_reviews' },
];

export function MerchantTabBar({ active, onChange }: TabBarProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            active === tab.key && { borderBottomColor: colors.primary, borderBottomWidth: 2.5 },
          ]}
          onPress={() => onChange(tab.key)}
        >
          <Text
            variant="label"
            color={active === tab.key ? colors.primary : colors.textSecondary}
          >
            {t(tab.labelKey)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: space.md,
  },
});
