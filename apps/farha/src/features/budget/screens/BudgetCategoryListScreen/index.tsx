import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppButton, AppCard, AppInput, AppPressable, AppScreenTemplate, AppText, SectionHeader } from '@dawwar/ui';

import { BudgetSummaryCard } from '../../components';
import { FarhaAdBanner } from '../../../monetization/ads/FarhaAdBanner';
import { getCategoryName } from '../../utils/categoryLabels';
import { usePlannerScreenChrome } from '../../../planner/hooks/usePlannerScreenChrome';
import { MissingEventState } from '../../../planner/states/MissingEventState';
import { money } from '../../../planner/utils/helpers';
import { useController } from './controller';
import { createStyles } from './styles';

export function BudgetCategoryListScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();
  const screen = usePlannerScreenChrome({
    title: t('farha.phase1.budgetCategories.title'),
    subtitle: ctrl.event?.title,
    showTabs: true,
    headerActions: (
      <AppButton
        label={t('farha.phase1.savings.title')}
        size="sm"
        variant="outline"
        onPress={ctrl.openSavings}
      />
    ),
  });

  if (!ctrl.event) return <MissingEventState />;

  return (
    <AppScreenTemplate {...screen.templateProps}>
      <ScrollView {...screen.scrollViewProps}>
        <BudgetSummaryCard title={t('farha.phase1.budgetCategories.totalHeader')} totals={ctrl.totals} />
        <FarhaAdBanner isPro={ctrl.isPro} placement="budget_categories" />
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
      </ScrollView>
    </AppScreenTemplate>
  );
}
