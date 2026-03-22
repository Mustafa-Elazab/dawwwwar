import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text, Icon } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { createStyles } from './styles';

interface QuickActionsProps {
  onCustomOrder: () => void;
  onCategory: (categoryId: string) => void;
}

const ACTIONS = [
  { id: 'custom', icon: 'plus-circle', labelKey: 'home.custom_order_btn', isCustom: true },
  { id: 'cat-01', icon: 'cart-outline', labelKey: 'categories.all', isCustom: false },
  { id: 'cat-02', icon: 'food-fork-drink', labelKey: 'merchant.tab_menu', isCustom: false },
  { id: 'cat-03', icon: 'pill', labelKey: 'categories.all', isCustom: false },
] as const;

export function QuickActions({ onCustomOrder, onCategory }: QuickActionsProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      {ACTIONS.map((action) => (
        <TouchableOpacity
          key={action.id}
          style={styles.item}
          onPress={action.isCustom ? onCustomOrder : () => onCategory(action.id)}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.iconCircle,
              action.isCustom ? styles.customCircle : styles.regularCircle,
            ]}
          >
            <Icon
              name={action.icon}
              size={26}
              color={action.isCustom ? '#fff' : colors.icon}
            />
          </View>
          <Text style={styles.label}>{t(action.labelKey)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
