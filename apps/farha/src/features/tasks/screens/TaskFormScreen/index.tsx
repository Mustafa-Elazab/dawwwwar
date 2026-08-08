import React, { useMemo } from 'react';
import { ScrollView, Switch, View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppButton, AppCard, AppInput, AppScreenTemplate, AppText, SectionHeader, SegmentedControl } from '@dawwar/ui';

import { CategorySelector } from '../../../budget/components';
import { DateField } from '../../../planner/components/DateField';
import { usePlannerScreenChrome } from '../../../planner/hooks/usePlannerScreenChrome';
import { MissingEventState } from '../../../planner/states/MissingEventState';
import { money } from '../../../planner/utils/helpers';
import { useController } from './controller';
import { createStyles } from './styles';

export function TaskFormScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();
  const screen = usePlannerScreenChrome({
    title: ctrl.editingTask ? t('farha.phase1.tasks.editTitle') : t('farha.phase1.tasks.addTitle'),
    subtitle: ctrl.event?.title,
    showBack: true,
  });

  if (!ctrl.event) return <MissingEventState />;

  return (
    <AppScreenTemplate {...screen.templateProps}>
      <ScrollView {...screen.scrollViewProps}>
        <View style={styles.stack}>
          <AppInput
            label={t('farha.phase1.labels.taskTitle')}
            value={ctrl.form.title}
            onChangeText={(title) => ctrl.setForm((current) => ({ ...current, title }))}
            error={ctrl.submitted && ctrl.validation.errors.title ? t('farha.phase1.validation.required') : undefined}
          />
          <SegmentedControl
            items={[
              { key: 'pending', label: t('farha.phase1.checklist.status.pending') },
              { key: 'done', label: t('farha.phase1.checklist.status.done') },
              { key: 'skipped', label: t('farha.phase1.checklist.status.skipped') },
            ]}
            activeKey={ctrl.form.status}
            onChange={(status) => ctrl.setForm((current) => ({ ...current, status: status === 'done' || status === 'skipped' ? status : 'pending' }))}
          />
          <CategorySelector
            categories={ctrl.categories}
            selectedCategoryId={ctrl.selectedCategoryId}
            onChange={(categoryId) => {
              const category = ctrl.categories.find((item) => item.id === categoryId);
              ctrl.setForm((current) => ({ ...current, category: category?.key }));
            }}
            allowNone
          />
          <DateField
            label={t('farha.phase1.labels.dueDate')}
            placeholder={t('farha.phase1.labels.datePlaceholder')}
            value={ctrl.form.dueDate}
            onChange={(dueDate) => ctrl.setForm((current) => ({ ...current, dueDate }))}
            error={ctrl.submitted && ctrl.validation.errors.dueDate ? t('farha.phase1.validation.invalidDate') : undefined}
            allowClear
          />
          <AppInput
            label={t('farha.phase1.labels.notes')}
            value={ctrl.form.notes}
            onChangeText={(notes) => ctrl.setForm((current) => ({ ...current, notes }))}
            multiline
            numberOfLines={3}
          />
          <AppCard variant="outlined" style={styles.section}>
            <View style={styles.row}>
              <View style={styles.rowText}>
                <SectionHeader title={t('farha.phase1.tasks.addCost')} />
                <AppText variant="caption" color={colors.textSecondary} align="auto">
                  {t('farha.phase1.tasks.addCostBody')}
                </AppText>
              </View>
              <Switch
                value={ctrl.form.hasCost}
                onValueChange={(hasCost) => ctrl.setForm((current) => ({ ...current, hasCost }))}
              />
            </View>
            {ctrl.form.hasCost ? (
              <View style={styles.stack}>
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
                <AppInput
                  label={t('farha.phase1.labels.depositPaid')}
                  keyboardType="numeric"
                  value={ctrl.form.depositPaid}
                  onChangeText={(depositPaid) => ctrl.setForm((current) => ({ ...current, depositPaid }))}
                  error={ctrl.submitted && ctrl.validation.errors.depositPaid ? t('farha.phase1.validation.invalidAmount') : undefined}
                />
                <View style={styles.successBox}>
                  <AppText variant="label" align="auto">
                    {t('farha.phase1.budgetForm.balanceRemaining')}: {money(t, ctrl.balance)}
                  </AppText>
                </View>
                <View style={styles.row}>
                  <View style={styles.rowText}>
                    <SectionHeader title={t('farha.phase1.tasks.payInInstallments')} />
                    <AppText variant="caption" color={colors.textSecondary} align="auto">
                      {t('farha.phase1.tasks.payInInstallmentsBody')}
                    </AppText>
                  </View>
                  <Switch
                    value={ctrl.form.hasPaymentPlan}
                    onValueChange={(hasPaymentPlan) => ctrl.setForm((current) => ({ ...current, hasPaymentPlan }))}
                  />
                </View>
                {ctrl.form.hasPaymentPlan ? (
                  <View style={styles.formGrid}>
                    <AppInput
                      containerStyle={styles.gridItem}
                      label={t('farha.phase1.tasks.monthlyAmount')}
                      keyboardType="numeric"
                      value={ctrl.form.monthlyAmount}
                      onChangeText={(monthlyAmount) => ctrl.setForm((current) => ({ ...current, monthlyAmount }))}
                      error={ctrl.submitted && ctrl.validation.errors.monthlyAmount ? t('farha.phase1.validation.invalidAmount') : undefined}
                    />
                    <DateField
                      containerStyle={styles.gridItem}
                      label={t('farha.phase1.tasks.nextDueDate')}
                      placeholder={t('farha.phase1.labels.datePlaceholder')}
                      value={ctrl.form.nextDueDate}
                      onChange={(nextDueDate) => ctrl.setForm((current) => ({ ...current, nextDueDate }))}
                      error={ctrl.submitted && ctrl.validation.errors.nextDueDate ? t('farha.phase1.validation.invalidDate') : undefined}
                    />
                  </View>
                ) : null}
              </View>
            ) : null}
          </AppCard>
        </View>
        <AppButton label={t('farha.phase1.actions.save')} onPress={ctrl.save} fullWidth />
        {ctrl.editingTask ? (
          <AppButton label={t('farha.phase1.actions.deleteTask')} variant="danger" onPress={ctrl.deleteTask} fullWidth />
        ) : null}
      </ScrollView>
    </AppScreenTemplate>
  );
}
