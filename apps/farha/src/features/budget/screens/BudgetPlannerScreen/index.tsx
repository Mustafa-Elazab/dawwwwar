import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import {
  AppButton,
  AppCard,
  AppInput,
  AppPressable,
  AppScreenTemplate,
  AppText,
  SectionHeader,
  SegmentedControl,
} from '@dawwar/ui';

import { farhaEventTypes } from '../../data/defaultBudgetCategories';
import {
  formatBudgetAmount,
  parseCurrencyInput,
  validateBudgetItemDraft,
} from '../../domain/budgetTotals';
import { useBudgetPlanner } from '../../hooks/useBudgetPlanner';
import type {
  BudgetCategory,
  BudgetItem,
  BudgetItemDraft,
  BudgetTotals,
  FarhaEventType,
} from '../../../../types';
import { createStyles } from './styles';

interface BudgetItemFormState {
  categoryId: string;
  title: string;
  plannedCost: string;
  actualCost: string;
  depositPaid: string;
  dueDate: string;
  notes: string;
}

const emptyForm: BudgetItemFormState = {
  categoryId: '',
  title: '',
  plannedCost: '',
  actualCost: '',
  depositPaid: '',
  dueDate: '',
  notes: '',
};

export function BudgetPlannerScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const planner = useBudgetPlanner();
  const [form, setForm] = useState<BudgetItemFormState>(emptyForm);
  const [editingItemId, setEditingItemId] = useState<string | undefined>();
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (!planner.categories.length) return;

    setForm((current) => {
      const hasCurrentCategory = planner.categories.some(
        (category) => category.id === current.categoryId,
      );

      if (hasCurrentCategory) return current;

      return {
        ...current,
        categoryId: planner.categories[0].id,
      };
    });
  }, [planner.categories]);

  const draft = useMemo((): BudgetItemDraft => ({
    id: editingItemId,
    categoryId: form.categoryId,
    title: form.title,
    plannedCost: parseCurrencyInput(form.plannedCost),
    actualCost: parseCurrencyInput(form.actualCost),
    depositPaid: parseCurrencyInput(form.depositPaid),
    dueDate: form.dueDate,
    notes: form.notes,
  }), [editingItemId, form]);

  const validation = useMemo(() => validateBudgetItemDraft(draft), [draft]);
  const selectedCategory = planner.categories.find((category) => category.id === form.categoryId);
  const eventTabs = useMemo(
    () =>
      farhaEventTypes.map((type) => ({
        key: type,
        label: t(`farha.m1.events.${type}`),
      })),
    [t],
  );

  const submit = () => {
    setHasSubmitted(true);

    if (!validation.isValid) return;

    planner.saveBudgetItem(draft);
    resetForm(planner.categories);
  };

  const editItem = (item: BudgetItem) => {
    setEditingItemId(item.id);
    setHasSubmitted(false);
    setForm({
      categoryId: item.categoryId,
      title: item.title,
      plannedCost: item.plannedCost ? String(item.plannedCost) : '',
      actualCost: item.actualCost ? String(item.actualCost) : '',
      depositPaid: item.depositPaid ? String(item.depositPaid) : '',
      dueDate: item.dueDate ?? '',
      notes: item.notes ?? '',
    });
  };

  const resetForm = (categories: BudgetCategory[]) => {
    setEditingItemId(undefined);
    setHasSubmitted(false);
    setForm({
      ...emptyForm,
      categoryId: categories[0]?.id ?? '',
    });
  };

  const getFieldError = (field: keyof BudgetItemDraft): string | undefined => {
    if (!hasSubmitted) return undefined;

    const errorKey = validation.errors[field];
    return errorKey ? t(`farha.m1.validation.${errorKey}`) : undefined;
  };

  const renderAmount = (amount: number) =>
    `${formatBudgetAmount(amount)} ${t('farha.m1.currencySuffix')}`;

  const activeEventName = planner.activeEvent
    ? t(planner.activeEvent.title)
    : t('farha.m1.events.wedding');

  return (
    <AppScreenTemplate
      testID="farha-budget-screen"
      contentStyle={styles.content}
      isLoading={planner.status === 'loading'}
      loadingMessage={t('farha.m1.activeEvent')}
      isError={planner.status === 'error'}
      errorMessage={planner.errorMessageKey ? t(planner.errorMessageKey) : undefined}
      onRetry={planner.reload}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <AppText variant="h2" align="auto">
            {t('farha.m1.title')}
          </AppText>
          <AppText variant="body1" color={colors.textSecondary} align="auto">
            {t('farha.m1.subtitle')}
          </AppText>
        </View>

        <AppCard variant="outlined" style={styles.section}>
          <SectionHeader title={t('farha.m1.activeEvent')} />
          <View style={styles.eventSummary}>
            <View style={styles.eventText}>
              <AppText variant="h3" align="auto">
                {activeEventName}
              </AppText>
              {planner.activeEvent ? (
                <AppText variant="body2" color={colors.textSecondary} align="auto">
                  {t('farha.m1.eventDate')}: {planner.activeEvent.date}
                </AppText>
              ) : null}
            </View>
          </View>
          <AppText variant="label" align="auto">
            {t('farha.m1.switchEvent')}
          </AppText>
          <SegmentedControl
            items={eventTabs}
            activeKey={planner.activeEvent?.type ?? 'wedding'}
            onChange={(key) => planner.selectOrCreateEventType(key as FarhaEventType)}
          />
        </AppCard>

        <AppCard variant="elevated" style={styles.section}>
          <SectionHeader title={t('farha.m1.totalsTitle')} />
          <View style={styles.metricsGrid}>
            <MetricCard label={t('farha.m1.plannedTotal')} value={renderAmount(planner.totals.plannedTotal)} />
            <MetricCard label={t('farha.m1.actualTotal')} value={renderAmount(planner.totals.actualTotal)} />
            <MetricCard label={t('farha.m1.depositTotal')} value={renderAmount(planner.totals.depositTotal)} />
            <MetricCard label={t('farha.m1.balanceTotal')} value={renderAmount(planner.totals.balanceTotal)} />
          </View>
          <VarianceBanner totals={planner.totals} renderAmount={renderAmount} />
        </AppCard>

        <AppCard variant="outlined" style={styles.section}>
          <SectionHeader
            title={editingItemId ? t('farha.m1.formTitleEdit') : t('farha.m1.formTitleAdd')}
          />
          <View style={styles.formFields}>
            <View>
              <AppText variant="label" align="auto" style={styles.fieldLabel}>
                {t('farha.m1.category')}
              </AppText>
              <View style={styles.categoryPicker}>
                {planner.categories.map((category) => {
                  const selected = category.id === selectedCategory?.id;

                  return (
                    <AppPressable
                      key={category.id}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      accessibilityLabel={t(category.nameKey)}
                      style={[
                        styles.categoryChip,
                        {
                          borderColor: selected ? colors.primary : colors.border,
                          backgroundColor: selected ? colors.primaryLight : colors.surface,
                        },
                      ]}
                      onPress={() => setForm((current) => ({ ...current, categoryId: category.id }))}
                    >
                      <AppText
                        variant="caption"
                        color={selected ? colors.primaryDark : colors.text}
                        align="center"
                        numberOfLines={2}
                      >
                        {t(category.nameKey)}
                      </AppText>
                    </AppPressable>
                  );
                })}
              </View>
              {getFieldError('categoryId') ? (
                <AppText variant="caption" color={colors.error} align="auto">
                  {getFieldError('categoryId')}
                </AppText>
              ) : null}
            </View>

            <AppInput
              label={t('farha.m1.itemTitle')}
              placeholder={t('farha.m1.itemTitlePlaceholder')}
              value={form.title}
              onChangeText={(title) => setForm((current) => ({ ...current, title }))}
              error={getFieldError('title')}
              testID="farha-budget-item-title"
            />
            <View style={styles.inputGrid}>
              <AppInput
                label={t('farha.m1.plannedCost')}
                keyboardType="numeric"
                value={form.plannedCost}
                onChangeText={(plannedCost) => setForm((current) => ({ ...current, plannedCost }))}
                error={getFieldError('plannedCost')}
              />
              <AppInput
                label={t('farha.m1.actualCost')}
                keyboardType="numeric"
                value={form.actualCost}
                onChangeText={(actualCost) => setForm((current) => ({ ...current, actualCost }))}
                error={getFieldError('actualCost')}
              />
            </View>
            <View style={styles.inputGrid}>
              <AppInput
                label={t('farha.m1.depositPaid')}
                keyboardType="numeric"
                value={form.depositPaid}
                onChangeText={(depositPaid) => setForm((current) => ({ ...current, depositPaid }))}
                error={getFieldError('depositPaid')}
              />
              <AppInput
                label={t('farha.m1.dueDate')}
                placeholder={t('farha.m1.dueDatePlaceholder')}
                value={form.dueDate}
                onChangeText={(dueDate) => setForm((current) => ({ ...current, dueDate }))}
              />
            </View>
            <AppInput
              label={t('farha.m1.notes')}
              placeholder={t('farha.m1.notesPlaceholder')}
              value={form.notes}
              onChangeText={(notes) => setForm((current) => ({ ...current, notes }))}
              multiline
              numberOfLines={3}
            />
          </View>
          <View style={styles.actionRow}>
            {editingItemId ? (
              <AppButton
                label={t('farha.m1.cancelEdit')}
                variant="outline"
                onPress={() => resetForm(planner.categories)}
                fullWidth
              />
            ) : null}
            <AppButton
              label={editingItemId ? t('farha.m1.updateItem') : t('farha.m1.saveItem')}
              onPress={submit}
              fullWidth
              testID="farha-budget-save-item"
            />
          </View>
        </AppCard>

        <AppCard variant="flat" style={styles.section}>
          <SectionHeader title={t('farha.m1.categorySummary')} />
          <View style={styles.listStack}>
            {planner.categorySummaries.map((summary) => (
              <View
                key={summary.category.id}
                style={[styles.summaryRow, { borderColor: colors.border }]}
              >
                <View style={styles.summaryText}>
                  <AppText variant="label" align="auto" numberOfLines={1}>
                    {t(summary.category.nameKey)}
                  </AppText>
                  <AppText variant="caption" color={colors.textSecondary} align="auto">
                    {t('farha.m1.itemCount', { count: summary.itemCount })}
                  </AppText>
                </View>
                <View style={styles.summaryAmounts}>
                  <AppText variant="caption" color={colors.textSecondary} align="auto">
                    {renderAmount(summary.plannedTotal)}
                  </AppText>
                  <AppText variant="label" align="auto">
                    {renderAmount(summary.actualTotal)}
                  </AppText>
                </View>
              </View>
            ))}
          </View>
        </AppCard>

        <AppCard variant="outlined" style={styles.section}>
          <SectionHeader title={t('farha.m1.latestItems')} />
          {planner.items.length ? (
            <View style={styles.listStack}>
              {planner.items.map((item) => {
                const category = planner.categories.find((candidate) => candidate.id === item.categoryId);

                return (
                  <AppPressable
                    key={item.id}
                    accessibilityRole="button"
                    accessibilityLabel={item.title}
                    style={[styles.itemRow, { borderColor: colors.border }]}
                    onPress={() => editItem(item)}
                  >
                    <View style={styles.itemText}>
                      <AppText variant="label" align="auto" numberOfLines={1}>
                        {item.title}
                      </AppText>
                      <AppText variant="caption" color={colors.textSecondary} align="auto">
                        {category ? t(category.nameKey) : t('farha.m1.category')}
                      </AppText>
                    </View>
                    <View style={styles.itemAmounts}>
                      <AppText variant="label" align="auto">
                        {renderAmount(item.actualCost)}
                      </AppText>
                      <AppText variant="caption" color={colors.textSecondary} align="auto">
                        {renderAmount(Math.max(item.actualCost - item.depositPaid, 0))}
                      </AppText>
                    </View>
                  </AppPressable>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <AppText variant="body2" color={colors.textSecondary} align="auto">
                {t('farha.m1.emptyItems')}
              </AppText>
            </View>
          )}
        </AppCard>
      </ScrollView>
    </AppScreenTemplate>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
}

function MetricCard({ label, value }: MetricCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.metricCard, { borderColor: colors.border }]}>
      <AppText variant="caption" color={colors.textSecondary} align="auto" numberOfLines={2}>
        {label}
      </AppText>
      <AppText variant="h4" align="auto" numberOfLines={1}>
        {value}
      </AppText>
    </View>
  );
}

interface VarianceBannerProps {
  totals: BudgetTotals;
  renderAmount: (amount: number) => string;
}

function VarianceBanner({ totals, renderAmount }: VarianceBannerProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isOver = totals.variance < 0;
  const isBalanced = totals.variance === 0;
  const label = isBalanced
    ? t('farha.m1.varianceBalanced')
    : `${t(isOver ? 'farha.m1.varianceOver' : 'farha.m1.varianceUnder')} ${renderAmount(Math.abs(totals.variance))}`;

  return (
    <View
      style={[
        styles.varianceBanner,
        {
          backgroundColor: isBalanced
            ? colors.surfaceVariant
            : isOver
              ? colors.errorBg
              : colors.successBg,
        },
      ]}
    >
      <AppText
        variant="label"
        color={isBalanced ? colors.textSecondary : isOver ? colors.error : colors.success}
        align="auto"
      >
        {label}
      </AppText>
    </View>
  );
}
