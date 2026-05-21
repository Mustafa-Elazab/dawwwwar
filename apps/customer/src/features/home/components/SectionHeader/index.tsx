import React from 'react';
import { View, StyleSheet, I18nManager } from 'react-native';
import { useTheme, layout, space, microInteractions, typography } from '@dawwar/theme';
import { Text, Icon, AnimatedPressable } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
}

export const SectionHeader = React.memo(function SectionHeader({
  title,
  onSeeAll,
}: SectionHeaderProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.row, { paddingHorizontal: layout.screenPaddingH }]}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {onSeeAll != null && (
        <AnimatedPressable
          onPress={onSeeAll}
          pressScale={microInteractions.pressScale}
          pressOpacity={microInteractions.pressOpacity}
          pressTranslateY={1}
          style={styles.seeAllBtn}
        >
          <Text
            variant="caption"
            color={colors.primary}
            style={{ fontWeight: '700', fontSize: 13 }}
          >
            {t('home.see_all')}
          </Text>
          <Icon
            name={I18nManager.isRTL ? 'chevron-left' : 'chevron-right'}
            size={16}
            color={colors.primary}
          />
        </AnimatedPressable>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...typography.title,
    fontSize: 18,
    fontWeight: '700',
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: space.xs,
    paddingHorizontal: space.xs,
  },
});
