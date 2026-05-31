import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { Text } from '@dawwar/ui';
import { createStyles } from '../styles';

export type OrdersTab = 'all' | 'active' | 'completed' | 'cancelled';

interface OrdersTabsProps {
  colors: AppColors;
  tabs: readonly OrdersTab[];
  activeTab: OrdersTab;
  labels: Record<OrdersTab, string>;
  onChange: (tab: OrdersTab) => void;
}

export function OrdersTabs({
  colors,
  tabs,
  activeTab,
  labels,
  onChange,
}: OrdersTabsProps) {
  const styles = createStyles(colors);

  return (
    <View style={styles.tabRow}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onChange(tab)}
          >
            <Text
              style={[
                styles.tabLabel,
                isActive ? styles.tabLabelActive : styles.tabLabelInactive,
              ]}
              color={isActive ? colors.primaryText : colors.textSecondary}
            >
              {isActive ? `✓ ${labels[tab]}` : labels[tab]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
