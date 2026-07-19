import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Dimensions, I18nManager } from 'react-native';
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

const { width } = Dimensions.get('window');
const TAB_WIDTH = width / TABS.length;

export function MerchantTabBar({ active, onChange }: TabBarProps) {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language.startsWith('ar') || I18nManager.isRTL;
  
  const activeIdx = TABS.findIndex(t => t.key === active);
  const indicatorAnim = useRef(new Animated.Value(activeIdx)).current;

  useEffect(() => {
    Animated.spring(indicatorAnim, {
      toValue: activeIdx,
      useNativeDriver: true,
      friction: 10,
      tension: 50,
    }).start();
  }, [activeIdx]);

  const translateX = indicatorAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: isRTL ? [TAB_WIDTH * 2, TAB_WIDTH, 0] : [0, TAB_WIDTH, TAB_WIDTH * 2],
  });

  return (
    <View style={[styles.row, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={styles.tab}
          onPress={() => onChange(tab.key)}
          activeOpacity={0.7}
        >
          <Text
            variant="label"
            style={{ 
              color: active === tab.key ? colors.primary : colors.textSecondary,
              fontWeight: active === tab.key ? '800' : '600',
              fontSize: 15,
            }}
          >
            {t(tab.labelKey)}
          </Text>
        </TouchableOpacity>
      ))}
      
      {/* Animated 3px Indicator */}
      <Animated.View 
        style={[
          styles.indicator, 
          { 
            backgroundColor: colors.primary,
            width: TAB_WIDTH,
            start: 0,
            transform: [{ translateX }]
          }
        ]} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    position: 'relative',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: space.md,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    borderRadius: 3,
  },
});
