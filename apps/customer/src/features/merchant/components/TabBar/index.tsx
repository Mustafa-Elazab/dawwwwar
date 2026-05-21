import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, I18nManager, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme, motion, easings, space, radius, microInteractions } from '@dawwar/theme';
import { Text, AnimatedPressable } from '@dawwar/ui';
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

const INDICATOR_HEIGHT = 3;

export function MerchantTabBar({ active, onChange }: TabBarProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isRTL = I18nManager.isRTL;

  const tabs = useMemo(() => (isRTL ? [...TABS].reverse() : TABS), [isRTL]);
  const tabWidth = width / tabs.length;
  const activeIdx = tabs.findIndex((tab) => tab.key === active);
  const indicatorX = useSharedValue(Math.max(activeIdx, 0) * tabWidth);

  useEffect(() => {
    indicatorX.value = withTiming(Math.max(activeIdx, 0) * tabWidth, {
      duration: motion.tabSwitchMs,
      easing: easings.standard,
    });
  }, [activeIdx, indicatorX, tabWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  return (
    <View style={[styles.row, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
      {tabs.map((tab) => (
        <AnimatedPressable
          key={tab.key}
          style={styles.tab}
          onPress={() => onChange(tab.key)}
          pressScale={microInteractions.pressScale}
          pressOpacity={microInteractions.pressOpacity}
          pressTranslateY={1}
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
        </AnimatedPressable>
      ))}

      <Animated.View 
        style={[
          styles.indicator, 
          { 
            backgroundColor: colors.primary,
            width: tabWidth,
            left: 0,
            borderRadius: radius.full,
          },
          indicatorStyle,
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
    height: INDICATOR_HEIGHT,
  },
});
