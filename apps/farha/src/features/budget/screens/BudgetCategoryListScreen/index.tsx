import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppButton, AppCard, AppInput, AppPressable, AppText, SectionHeader } from '@dawwar/ui';

import { BudgetSummaryCard } from '../../components';
import { getCategoryName } from '../../utils/categoryLabels';
import { AdBanner } from '../../../monetization/components';
import { MissingEvent, ScreenFrame } from '../../../planner/components';
import { money } from '../../../planner/utils/helpers';
import type { Phase1ScreenProps } from '../../../planner/types/screenTypes';
import { createStyles } from './styles';
import { useController } from '../../hooks/useBudgetCategoryListController';

export function BudgetCategoryListScreen({ controller }: Phase1ScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController(controller);

  if (!ctrl.event) return <MissingEvent controller={controller} />;

  return (
    <ScreenFrame
      title={t('farha.phase1.budgetCategories.title')}
      subtitle={ctrl.event.title}
      controller={controller}
      showTabs
    >
      <BudgetSummaryCard title={t('farha.phase1.budgetCategories.totalHeader')} totals={ctrl.totals} />
      <AppCard variant="outlined" style={styles.section}>
        <SectionHeader title={t('farha.phase1.budgetCategories.addCategory')} />
        <AppInput
          label={t('farha.phase1.labels.categoryName')}
          value={ctrl.categoryName}
          onChangeText={ctrl.setCategoryName}
          error={ctrl.submitted && ctrl.validation.errors.name ? t('farha.phase1.validation.required') : undefined}
        />
        <AppButton
          label={t('farha.phase1.actions.addCategory')}
          onPress={ctrl.addCategory}
          fullWidth
        />
      </AppCard>
      <View style={styles.stack}>
        {ctrl.categories.map(({ category, itemCount, totals }) => (
          <AppPressable
            key={category.id}
            accessibilityRole="button"
            accessibilityLabel={getCategoryName(t, category)}
            style={styles.listRow}
            onPress={() => ctrl.openCategory(category.id)}
          >
            <View style={styles.rowText}>
              <AppText variant="label" align="auto">{getCategoryName(t, category)}</AppText>
              <AppText variant="caption" color={colors.textSecondary} align="auto">
                {t('farha.phase1.labels.itemCount', { count: itemCount })}
              </AppText>
            </View>
            <View style={styles.rowSide}>
              <AppText variant="caption" color={colors.textSecondary} align="auto">
                {money(t, totals.plannedTotal)}
              </AppText>
              <AppText variant="label" align="auto">{money(t, totals.actualTotal)}</AppText>
            </View>
            {!category.isDefault || itemCount === 0 ? (
              <AppButton
                label={t('farha.phase1.actions.deleteShort')}
                size="sm"
                variant="ghost"
                onPress={() => ctrl.deleteCategory(category.id)}
              />
            ) : null}
          </AppPressable>
        ))}
      </View>
      {!ctrl.isPro ? <AdBanner /> : null}
    </ScreenFrame>
  );
}
