import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppButton, AppInput, AppScreenTemplate, AppText } from '@dawwar/ui';

import { getCategoryName } from '../../utils/categoryLabels';
import { usePlannerScreenChrome } from '../../../planner/hooks/usePlannerScreenChrome';
import { DateField } from '../../../planner/components/DateField';
import { money } from '../../../planner/utils/helpers';
import { useController } from './controller';
import { createStyles } from './styles';

export function BudgetItemFormScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();
  const screen = usePlannerScreenChrome({
    title: ctrl.category
      ? (ctrl.editingItem ? t('farha.phase1.budgetForm.editTitle') : t('farha.phase1.budgetForm.addTitle'))
      : t('farha.phase1.errors.missingCategory'),
    subtitle: ctrl.category ? getCategoryName(t, ctrl.category) : undefined,
    showBack: true,
  });

  if (!ctrl.category) {
    return <AppScreenTemplate {...screen.templateProps} />;
  }

  return (
    <AppScreenTemplate {...screen.templateProps}>
      <ScrollView {...screen.scrollViewProps}>
        <View style={styles.stack}>
          <AppInput
            label={t('farha.phase1.labels.itemName')}
            value={ctrl.form.name}
            onChangeText={(name) => ctrl.setForm((current) => ({ ...current, name }))}
            error={ctrl.submitted && ctrl.validation.errors.name ? t('farha.phase1.validation.required') : undefined}
          />
          <View style={styles.formGrid}>
            <AppInput
              containerStyle={styles.gridItem}
              label={t('farha.phase1.labels.plannedCost')}
              keyboardType="numeric"
              value={ctrl.form.plannedCost}
              onChangeText={(plannedCost) => ctrl.setForm((current) => ({ ...current, plannedCost }))}
              error={ctrl.submitted && ctrl.validation.errors.plannedCost ? t('farha.phase1.validation.invalidAmount') : undefined}
            />
            <AppInput
              containerStyle={styles.gridItem}
              label={t('farha.phase1.labels.actualCost')}
              keyboardType="numeric"
              value={ctrl.form.actualCost}
              onChangeText={(actualCost) => ctrl.setForm((current) => ({ ...current, actualCost }))}
              error={ctrl.submitted && ctrl.validation.errors.actualCost ? t('farha.phase1.validation.invalidAmount') : undefined}
            />
          </View>
          <View style={styles.formGrid}>
            <AppInput
              containerStyle={styles.gridItem}
              label={t('farha.phase1.labels.depositPaid')}
              keyboardType="numeric"
              value={ctrl.form.depositPaid}
              onChangeText={(depositPaid) => ctrl.setForm((current) => ({ ...current, depositPaid }))}
              error={ctrl.submitted && ctrl.validation.errors.depositPaid ? t('farha.phase1.validation.invalidAmount') : undefined}
            />
           
          </View>
          <DateField
              testID="farha-budget-item-due-date"
              containerStyle={styles.gridItem}
              label={t('farha.phase1.labels.dueDate')}
              placeholder={t('farha.phase1.labels.datePlaceholder')}
              value={ctrl.form.dueDate}
              onChange={(dueDate) => ctrl.setForm((current) => ({ ...current, dueDate }))}
              allowClear
            />
          <AppInput
            label={t('farha.phase1.labels.notes')}
            value={ctrl.form.notes}
            onChangeText={(notes) => ctrl.setForm((current) => ({ ...current, notes }))}
            multiline
            numberOfLines={3}
          />
          <View style={ctrl.validation.warnings.depositPaid ? styles.warningBox : styles.successBox}>
            <AppText variant="label" align="auto">
              {t('farha.phase1.budgetForm.balanceRemaining')}: {money(t, ctrl.balance)}
            </AppText>
            {ctrl.validation.warnings.depositPaid ? (
              <AppText variant="caption" align="auto">{t('farha.phase1.validation.depositOverTotal')}</AppText>
            ) : null}
            {ctrl.fundAllocationWarning ? (
              <AppText variant="caption" align="auto">
                {t('farha.phase1.savings.depositBelowFundAllocation', {
                  amount: money(t, ctrl.fundAllocatedToItem),
                })}
              </AppText>
            ) : null}
          </View>
        </View>
        <AppButton
          label={t('farha.phase1.actions.save')}
          onPress={ctrl.save}
          fullWidth
        />
        {ctrl.editingItem ? (
          <AppButton
            label={t('farha.phase1.actions.deleteItem')}
            variant="danger"
            onPress={ctrl.deleteItem}
            fullWidth
          />
        ) : null}
      </ScrollView>
    </AppScreenTemplate>
  );
}
