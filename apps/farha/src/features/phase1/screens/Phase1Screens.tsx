import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, Switch, View } from 'react-native';
import { i18n, updateLanguage, useTranslation, type AppLanguage } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import {
  AppBadge,
  AppButton,
  AppCard,
  AppInput,
  AppPressable,
  AppScreenTemplate,
  AppText,
  EmptyState,
  SectionHeader,
  SegmentedControl,
  StepIndicator,
} from '@dawwar/ui';

import type { Phase1PlannerController } from '../hooks/usePhase1Planner';
import {
  calculateBudgetTotals,
  calculateItemBalance,
  createSharePayload,
  formatCurrency,
  getBudgetItemStatus,
  getChecklistSummary,
  getCountdownDays,
  getEventBudgetItems,
  getEventChecklistItems,
  isOverdue,
  parseCurrencyInput,
  phase1EventTypes,
  validateBudgetCategoryDraft,
  validateBudgetItemDraft,
  validateChecklistItemDraft,
  validateEventDraft,
} from '../domain/phase1Logic';
import type {
  BudgetItemDraft,
  ChecklistItemDraft,
  EventFormDraft,
  FarhaPhase1BudgetCategory,
  FarhaPhase1BudgetItem,
  FarhaPhase1ChecklistItem,
  FarhaPhase1Event,
  FarhaPhase1EventType,
  Phase1TabKey,
} from '../domain/phase1Types';
import { createPhase1Styles } from './styles';

interface Phase1ScreenProps {
  controller: Phase1PlannerController;
}

interface EventFormState {
  type: FarhaPhase1EventType;
  title: string;
  date: string;
}

interface BudgetItemFormState {
  categoryId: string;
  name: string;
  plannedCost: string;
  actualCost: string;
  depositPaid: string;
  dueDate: string;
  notes: string;
}

interface ChecklistItemFormState {
  title: string;
  dueDate: string;
  categoryId: string;
  notes: string;
}

const defaultEventForm: EventFormState = {
  type: 'wedding',
  title: '',
  date: getDefaultFutureDate(),
};

const emptyBudgetItemForm: BudgetItemFormState = {
  categoryId: '',
  name: '',
  plannedCost: '',
  actualCost: '',
  depositPaid: '',
  dueDate: '',
  notes: '',
};

const emptyChecklistItemForm: ChecklistItemFormState = {
  title: '',
  dueDate: '',
  categoryId: '',
  notes: '',
};

export function SplashScreen({ controller }: Phase1ScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createPhase1Styles(colors), [colors]);

  return (
    <AppScreenTemplate contentStyle={styles.screenContent} isLoading={controller.status === 'loading'}>
      <ScrollView contentContainerStyle={[styles.scrollContent, styles.centered]}>
        <View style={styles.cardTint}>
          <AppText variant="h1" align="center">{t('farha.phase1.brand')}</AppText>
          <AppText variant="body1" color={colors.textSecondary} align="center">
            {t('farha.phase1.splash.subtitle')}
          </AppText>
        </View>
      </ScrollView>
    </AppScreenTemplate>
  );
}

export function OnboardingWelcomeScreen({ controller }: Phase1ScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useLocalStyles();
  const slides = ['budget', 'checklist', 'share'] as const;

  return (
    <ScreenFrame title={t('farha.phase1.onboarding.title')} subtitle={t('farha.phase1.onboarding.subtitle')}>
      <View style={styles.stack}>
        {slides.map((slide) => (
          <AppCard key={slide} variant="outlined" style={styles.section}>
            <AppText variant="h4" align="auto">{t(`farha.phase1.onboarding.${slide}.title`)}</AppText>
            <AppText variant="body2" color={colors.textSecondary} align="auto">
              {t(`farha.phase1.onboarding.${slide}.body`)}
            </AppText>
          </AppCard>
        ))}
      </View>
      <View style={styles.stack}>
        <AppButton label={t('farha.phase1.actions.getStarted')} onPress={controller.completeOnboarding} fullWidth />
        <AppButton label={t('farha.phase1.actions.skip')} variant="ghost" onPress={controller.completeOnboarding} fullWidth />
      </View>
    </ScreenFrame>
  );
}

export function EventCreateScreen({ controller }: Phase1ScreenProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState<EventFormState>(defaultEventForm);
  const [submitted, setSubmitted] = useState(false);
  const draft: EventFormDraft = { ...form };
  const validation = validateEventDraft(draft);

  const submit = () => {
    setSubmitted(true);
    if (!validation.isValid) return;
    controller.createEvent(draft);
  };

  return (
    <ScreenFrame
      title={t('farha.phase1.eventCreate.title')}
      subtitle={t('farha.phase1.eventCreate.subtitle')}
    >
      <EventForm
        form={form}
        submitted={submitted}
        onChange={setForm}
      />
      <AppButton label={t('farha.phase1.actions.createEvent')} onPress={submit} fullWidth />
    </ScreenFrame>
  );
}

export function EventListScreen({ controller }: Phase1ScreenProps) {
  const { t } = useTranslation();
  const styles = useLocalStyles();

  return (
    <ScreenFrame title={t('farha.phase1.eventList.title')} subtitle={t('farha.phase1.eventList.subtitle')}>
      {controller.state.events.length ? (
        <View style={styles.stack}>
          {controller.state.events.map((event) => (
            <EventCard
              key={event.id}
              controller={controller}
              event={event}
              onPress={() => controller.openEvent(event.id)}
            />
          ))}
        </View>
      ) : (
        <EmptyState title={t('farha.phase1.eventList.emptyTitle')} subtitle={t('farha.phase1.eventList.emptyBody')} />
      )}
      <AppButton
        label={t('farha.phase1.actions.addEvent')}
        onPress={() => {
          if (!controller.state.isPro && controller.state.events.length >= 1) {
            controller.navigate('ProUpgradeScreen', { from: 'EventListScreen' });
            return;
          }
          controller.navigate('EventCreateScreen');
        }}
        fullWidth
      />
    </ScreenFrame>
  );
}

export function EventDashboardScreen({ controller }: Phase1ScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const event = getScreenEvent(controller);
  const styles = useLocalStyles();

  if (!event) return <MissingEvent controller={controller} />;

  const budgetItems = getEventBudgetItems(controller.state, event.id);
  const checklistItems = getEventChecklistItems(controller.state, event.id);
  const budgetTotals = calculateBudgetTotals(budgetItems);
  const checklistSummary = getChecklistSummary(checklistItems);

  return (
    <ScreenFrame
      title={event.title}
      subtitle={formatCountdown(t, event)}
      controller={controller}
      showTabs
      headerActions={(
        <View style={styles.headerActions}>
          <AppButton label={t('farha.phase1.actions.editEvent')} size="sm" variant="outline" onPress={() => controller.navigate('EventEditScreen', { eventId: event.id })} />
          {controller.state.isPro ? (
            <AppButton label={t('farha.phase1.actions.switchEvent')} size="sm" variant="outline" onPress={() => controller.navigate('EventListScreen')} />
          ) : null}
        </View>
      )}
    >
      <BudgetSummaryCard
        title={t('farha.phase1.dashboard.budgetSummary')}
        totals={budgetTotals}
        onPress={() => controller.openTab('budget')}
      />
      <AppCard variant="outlined" style={styles.section} onPress={() => controller.openTab('checklist')}>
        <SectionHeader title={t('farha.phase1.dashboard.checklistSummary')} />
        <AppText variant="h3" align="auto">
          {t('farha.phase1.checklist.progress', {
            done: checklistSummary.doneCount,
            total: checklistSummary.actionableTotal,
          })}
        </AppText>
        <AppText variant="body2" color={colors.textSecondary} align="auto">
          {checklistSummary.nextPending
            ? `${getChecklistTitle(t, checklistSummary.nextPending)} - ${checklistSummary.nextPending.dueDate ?? t('farha.phase1.labels.noDueDate')}`
            : t('farha.phase1.checklist.noPending')}
        </AppText>
      </AppCard>
      <AppButton label={t('farha.phase1.actions.shareResults')} onPress={() => controller.navigate('ShareCardPreviewScreen', { eventId: event.id })} fullWidth />
      {!controller.state.isPro ? <AdBanner /> : null}
    </ScreenFrame>
  );
}

export function EventEditScreen({ controller }: Phase1ScreenProps) {
  const { t } = useTranslation();
  const event = getScreenEvent(controller);
  const [form, setForm] = useState<EventFormState>(eventToForm(event));
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => setForm(eventToForm(event)), [event]);

  if (!event) return <MissingEvent controller={controller} />;

  const draft: EventFormDraft = { id: event.id, ...form };
  const validation = validateEventDraft(draft);

  return (
    <ScreenFrame title={t('farha.phase1.eventEdit.title')} controller={controller} showBack>
      <EventForm form={form} submitted={submitted} onChange={setForm} />
      <AppButton
        label={t('farha.phase1.actions.save')}
        onPress={() => {
          setSubmitted(true);
          if (validation.isValid) controller.updateEvent(draft);
        }}
        fullWidth
      />
      <AppButton
        label={t('farha.phase1.actions.deleteEvent')}
        variant="danger"
        onPress={() => confirmAction(
          t('farha.phase1.confirm.deleteEvent'),
          () => controller.deleteEvent(event.id),
          t('farha.phase1.confirm.cancel'),
          t('farha.phase1.confirm.ok'),
        )}
        fullWidth
      />
    </ScreenFrame>
  );
}

export function BudgetCategoryListScreen({ controller }: Phase1ScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const event = getScreenEvent(controller);
  const styles = useLocalStyles();
  const [categoryName, setCategoryName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!event) return <MissingEvent controller={controller} />;

  const totals = calculateBudgetTotals(controller.getEventBudgetItems(event.id));
  const validation = validateBudgetCategoryDraft({ eventId: event.id, name: categoryName });

  return (
    <ScreenFrame title={t('farha.phase1.budgetCategories.title')} subtitle={event.title} controller={controller} showTabs>
      <BudgetSummaryCard title={t('farha.phase1.budgetCategories.totalHeader')} totals={totals} />
      <AppCard variant="outlined" style={styles.section}>
        <SectionHeader title={t('farha.phase1.budgetCategories.addCategory')} />
        <AppInput
          label={t('farha.phase1.labels.categoryName')}
          value={categoryName}
          onChangeText={setCategoryName}
          error={submitted && validation.errors.name ? t('farha.phase1.validation.required') : undefined}
        />
        <AppButton
          label={t('farha.phase1.actions.addCategory')}
          onPress={() => {
            setSubmitted(true);
            if (!validation.isValid) return;
            controller.addBudgetCategory({ eventId: event.id, name: categoryName });
            setCategoryName('');
            setSubmitted(false);
          }}
          fullWidth
        />
      </AppCard>
      <View style={styles.stack}>
        {controller.getEventCategories(event.id).map((category) => {
          const items = controller.getCategoryItems(category.id);
          const categoryTotals = calculateBudgetTotals(items);
          return (
            <AppPressable
              key={category.id}
              accessibilityRole="button"
              accessibilityLabel={getCategoryName(t, category)}
              style={styles.listRow}
              onPress={() => controller.navigate('BudgetItemListScreen', { eventId: event.id, categoryId: category.id })}
            >
              <View style={styles.rowText}>
                <AppText variant="label" align="auto">{getCategoryName(t, category)}</AppText>
                <AppText variant="caption" color={colors.textSecondary} align="auto">
                  {t('farha.phase1.labels.itemCount', { count: items.length })}
                </AppText>
              </View>
              <View style={styles.rowSide}>
                <AppText variant="caption" color={colors.textSecondary} align="auto">
                  {money(t, categoryTotals.plannedTotal)}
                </AppText>
                <AppText variant="label" align="auto">{money(t, categoryTotals.actualTotal)}</AppText>
              </View>
              {!category.isDefault || items.length === 0 ? (
                <AppButton
                  label={t('farha.phase1.actions.deleteShort')}
                  size="sm"
                  variant="ghost"
                  onPress={() => confirmAction(
                    t('farha.phase1.confirm.deleteCategory'),
                    () => controller.deleteBudgetCategory(category.id),
                    t('farha.phase1.confirm.cancel'),
                    t('farha.phase1.confirm.ok'),
                  )}
                />
              ) : null}
            </AppPressable>
          );
        })}
      </View>
      {!controller.state.isPro ? <AdBanner /> : null}
    </ScreenFrame>
  );
}

export function BudgetItemListScreen({ controller }: Phase1ScreenProps) {
  const { t } = useTranslation();
  const category = controller.getCategoryById(controller.route.params?.categoryId);
  const styles = useLocalStyles();

  if (!category) {
    return <ScreenFrame title={t('farha.phase1.errors.missingCategory')} controller={controller} showBack />;
  }

  const items = controller.getCategoryItems(category.id);

  return (
    <ScreenFrame title={getCategoryName(t, category)} subtitle={t('farha.phase1.budgetItems.subtitle')} controller={controller} showBack>
      <AppButton label={t('farha.phase1.actions.addItem')} onPress={() => controller.navigate('BudgetItemFormScreen', { categoryId: category.id })} fullWidth />
      {items.length ? (
        <View style={styles.stack}>
          {items.map((item) => (
            <BudgetItemRow
              key={item.id}
              item={item}
              onPress={() => controller.navigate('BudgetItemFormScreen', { categoryId: category.id, budgetItemId: item.id })}
            />
          ))}
        </View>
      ) : (
        <EmptyState title={t('farha.phase1.budgetItems.emptyTitle')} subtitle={t('farha.phase1.budgetItems.emptyBody')} />
      )}
    </ScreenFrame>
  );
}

export function BudgetItemFormScreen({ controller }: Phase1ScreenProps) {
  const { t } = useTranslation();
  const category = controller.getCategoryById(controller.route.params?.categoryId);
  const editingItem = controller.getBudgetItemById(controller.route.params?.budgetItemId);
  const styles = useLocalStyles();
  const [form, setForm] = useState<BudgetItemFormState>(budgetItemToForm(editingItem, category));
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => setForm(budgetItemToForm(editingItem, category)), [category, editingItem]);

  if (!category) return <ScreenFrame title={t('farha.phase1.errors.missingCategory')} controller={controller} showBack />;

  const draft = formToBudgetDraft(form, editingItem?.id, category.id);
  const validation = validateBudgetItemDraft(draft);
  const balance = (draft.actualCost ?? draft.plannedCost) - draft.depositPaid;

  return (
    <ScreenFrame title={editingItem ? t('farha.phase1.budgetForm.editTitle') : t('farha.phase1.budgetForm.addTitle')} subtitle={getCategoryName(t, category)} controller={controller} showBack>
      <View style={styles.stack}>
        <AppInput label={t('farha.phase1.labels.itemName')} value={form.name} onChangeText={(name) => setForm((current) => ({ ...current, name }))} error={submitted && validation.errors.name ? t('farha.phase1.validation.required') : undefined} />
        <View style={styles.formGrid}>
          <AppInput containerStyle={styles.gridItem} label={t('farha.phase1.labels.plannedCost')} keyboardType="numeric" value={form.plannedCost} onChangeText={(plannedCost) => setForm((current) => ({ ...current, plannedCost }))} error={submitted && validation.errors.plannedCost ? t('farha.phase1.validation.invalidAmount') : undefined} />
          <AppInput containerStyle={styles.gridItem} label={t('farha.phase1.labels.actualCost')} keyboardType="numeric" value={form.actualCost} onChangeText={(actualCost) => setForm((current) => ({ ...current, actualCost }))} error={submitted && validation.errors.actualCost ? t('farha.phase1.validation.invalidAmount') : undefined} />
        </View>
        <View style={styles.formGrid}>
          <AppInput containerStyle={styles.gridItem} label={t('farha.phase1.labels.depositPaid')} keyboardType="numeric" value={form.depositPaid} onChangeText={(depositPaid) => setForm((current) => ({ ...current, depositPaid }))} error={submitted && validation.errors.depositPaid ? t('farha.phase1.validation.invalidAmount') : undefined} />
          <AppInput containerStyle={styles.gridItem} label={t('farha.phase1.labels.dueDate')} placeholder={t('farha.phase1.labels.datePlaceholder')} value={form.dueDate} onChangeText={(dueDate) => setForm((current) => ({ ...current, dueDate }))} />
        </View>
        <AppInput label={t('farha.phase1.labels.notes')} value={form.notes} onChangeText={(notes) => setForm((current) => ({ ...current, notes }))} multiline numberOfLines={3} />
        <View style={validation.warnings.depositPaid ? styles.warningBox : styles.successBox}>
          <AppText variant="label" align="auto">
            {t('farha.phase1.budgetForm.balanceRemaining')}: {money(t, balance)}
          </AppText>
          {validation.warnings.depositPaid ? (
            <AppText variant="caption" align="auto">{t('farha.phase1.validation.depositOverTotal')}</AppText>
          ) : null}
        </View>
      </View>
      <AppButton
        label={t('farha.phase1.actions.save')}
        onPress={() => {
          setSubmitted(true);
          if (validation.isValid) controller.saveBudgetItem(draft);
        }}
        fullWidth
      />
      {editingItem ? (
        <AppButton
          label={t('farha.phase1.actions.deleteItem')}
          variant="danger"
          onPress={() => confirmAction(
            t('farha.phase1.confirm.deleteItem'),
            () => controller.deleteBudgetItem(editingItem.id),
            t('farha.phase1.confirm.cancel'),
            t('farha.phase1.confirm.ok'),
          )}
          fullWidth
        />
      ) : null}
    </ScreenFrame>
  );
}

export function ChecklistTimelineScreen({ controller }: Phase1ScreenProps) {
  const { t } = useTranslation();
  const event = getScreenEvent(controller);
  const styles = useLocalStyles();

  if (!event) return <MissingEvent controller={controller} />;

  const items = controller.getEventChecklistItems(event.id);
  const summary = getChecklistSummary(items);

  return (
    <ScreenFrame title={t('farha.phase1.checklist.title')} subtitle={event.title} controller={controller} showTabs>
      <AppCard variant="outlined" style={styles.section}>
        <SectionHeader title={t('farha.phase1.checklist.progressTitle')} />
        <StepIndicator
          steps={[t('farha.phase1.checklist.pending'), t('farha.phase1.checklist.done'), t('farha.phase1.checklist.skipped')]}
          currentStep={summary.doneCount >= summary.actionableTotal && summary.actionableTotal > 0 ? 1 : 0}
        />
        <AppText variant="h3" align="auto">
          {t('farha.phase1.checklist.progress', { done: summary.doneCount, total: summary.actionableTotal })}
        </AppText>
      </AppCard>
      <AppButton label={t('farha.phase1.actions.addTask')} onPress={() => controller.navigate('ChecklistItemEditScreen', { eventId: event.id })} fullWidth />
      {items.length ? (
        <View style={styles.stack}>
          {items.map((item) => (
            <ChecklistRow
              key={item.id}
              controller={controller}
              item={item}
              onPress={() => controller.navigate('ChecklistItemEditScreen', { eventId: event.id, checklistItemId: item.id })}
            />
          ))}
        </View>
      ) : (
        <EmptyState title={t('farha.phase1.checklist.emptyTitle')} subtitle={t('farha.phase1.checklist.emptyBody')} />
      )}
    </ScreenFrame>
  );
}

export function ChecklistItemEditScreen({ controller }: Phase1ScreenProps) {
  const { t } = useTranslation();
  const event = getScreenEvent(controller);
  const editingItem = controller.getChecklistItemById(controller.route.params?.checklistItemId);
  const styles = useLocalStyles();
  const [form, setForm] = useState<ChecklistItemFormState>(checklistItemToForm(editingItem, t));
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => setForm(checklistItemToForm(editingItem, t)), [editingItem, t]);

  if (!event) return <MissingEvent controller={controller} />;

  const draft: ChecklistItemDraft = {
    id: editingItem?.id,
    eventId: event.id,
    title: form.title,
    dueDate: form.dueDate,
    categoryId: form.categoryId || undefined,
    notes: form.notes,
  };
  const validation = validateChecklistItemDraft(draft);

  return (
    <ScreenFrame title={editingItem ? t('farha.phase1.checklistForm.editTitle') : t('farha.phase1.checklistForm.addTitle')} controller={controller} showBack>
      <View style={styles.stack}>
        <AppInput label={t('farha.phase1.labels.taskTitle')} value={form.title} onChangeText={(title) => setForm((current) => ({ ...current, title }))} error={submitted && validation.errors.title ? t('farha.phase1.validation.required') : undefined} />
        <AppInput label={t('farha.phase1.labels.dueDate')} placeholder={t('farha.phase1.labels.datePlaceholder')} value={form.dueDate} onChangeText={(dueDate) => setForm((current) => ({ ...current, dueDate }))} error={submitted && validation.errors.dueDate ? t('farha.phase1.validation.invalidDate') : undefined} />
        <CategorySelector controller={controller} event={event} selectedCategoryId={form.categoryId} onChange={(categoryId) => setForm((current) => ({ ...current, categoryId }))} allowNone />
        <AppInput label={t('farha.phase1.labels.notes')} value={form.notes} onChangeText={(notes) => setForm((current) => ({ ...current, notes }))} multiline numberOfLines={3} />
      </View>
      <AppButton label={t('farha.phase1.actions.save')} onPress={() => {
        setSubmitted(true);
        if (validation.isValid) controller.saveChecklistItem(draft);
      }} fullWidth />
      {editingItem ? (
        <>
          <View style={styles.wrapRow}>
            <AppButton label={t('farha.phase1.checklist.markDone')} size="sm" onPress={() => controller.setChecklistItemStatus(editingItem.id, 'done')} />
            <AppButton label={t('farha.phase1.checklist.markSkipped')} size="sm" variant="outline" onPress={() => controller.setChecklistItemStatus(editingItem.id, 'skipped')} />
          </View>
          <AppButton
            label={t('farha.phase1.actions.deleteTask')}
            variant="danger"
            onPress={() => confirmAction(
              t('farha.phase1.confirm.deleteTask'),
              () => controller.deleteChecklistItem(editingItem.id),
              t('farha.phase1.confirm.cancel'),
              t('farha.phase1.confirm.ok'),
            )}
            fullWidth
          />
        </>
      ) : null}
    </ScreenFrame>
  );
}

export function ShareCardPreviewScreen({ controller }: Phase1ScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const event = getScreenEvent(controller);
  const styles = useLocalStyles();

  if (!event) return <MissingEvent controller={controller} />;

  const totals = calculateBudgetTotals(controller.getEventBudgetItems(event.id));
  const summary = getChecklistSummary(controller.getEventChecklistItems(event.id));

  return (
    <ScreenFrame title={t('farha.phase1.share.title')} subtitle={t('farha.phase1.share.subtitle')} controller={controller} showBack>
      <View style={styles.shareCard}>
        <View style={styles.stack}>
          <AppText variant="h2" align="auto">{event.title}</AppText>
          <AppText variant="body2" align="auto">{event.date} - {formatCountdown(t, event)}</AppText>
        </View>
        <View style={styles.stack}>
          <AppText variant="h4" align="auto">{t('farha.phase1.share.budgetLine', { planned: money(t, totals.plannedTotal), actual: money(t, totals.actualTotal) })}</AppText>
          <AppText variant="h4" align="auto">{t('farha.phase1.checklist.progress', { done: summary.doneCount, total: summary.actionableTotal })}</AppText>
          <BudgetBadge totals={totals} />
        </View>
        <AppText variant="caption" align="auto">{t('farha.phase1.share.madeWith')}</AppText>
      </View>
      <AppButton label={t('farha.phase1.actions.share')} onPress={controller.shareActiveEvent} fullWidth />
      <AppButton label={t('farha.phase1.actions.saveImage')} variant="outline" disabled fullWidth />
      <AppText variant="caption" color={colors.textSecondary} align="auto">
        {createSharePayload(controller.state, event.id)}
      </AppText>
    </ScreenFrame>
  );
}

export function ProUpgradeScreen({ controller }: Phase1ScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useLocalStyles();
  const benefits = ['unlimitedEvents', 'templates', 'noAds'] as const;

  return (
    <ScreenFrame title={t('farha.phase1.pro.title')} subtitle={t('farha.phase1.pro.subtitle')} controller={controller} showBack>
      <View style={styles.stack}>
        {benefits.map((benefit) => (
          <AppCard key={benefit} variant="outlined" style={styles.section}>
            <AppText variant="h4" align="auto">{t(`farha.phase1.pro.${benefit}.title`)}</AppText>
            <AppText variant="body2" color={colors.textSecondary} align="auto">{t(`farha.phase1.pro.${benefit}.body`)}</AppText>
          </AppCard>
        ))}
      </View>
      <AppButton label={t('farha.phase1.actions.upgrade')} onPress={controller.upgradeToPro} fullWidth />
      <AppButton label={t('farha.phase1.actions.restorePurchase')} variant="ghost" onPress={controller.restorePurchase} fullWidth />
    </ScreenFrame>
  );
}

export function SettingsScreen({ controller }: Phase1ScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useLocalStyles();
  const language = (i18n.language === 'en' ? 'en' : 'ar') as AppLanguage;

  return (
    <ScreenFrame title={t('farha.phase1.settings.title')} subtitle={t('farha.phase1.settings.subtitle')} controller={controller} showTabs>
      <AppCard variant="outlined" style={styles.section}>
        <SectionHeader title={t('farha.phase1.settings.language')} />
        <View style={styles.wrapRow}>
          <AppButton label={t('farha.phase1.settings.arabic')} variant={language === 'ar' ? 'primary' : 'outline'} onPress={() => void updateLanguage('ar')} />
          <AppButton label={t('farha.phase1.settings.english')} variant={language === 'en' ? 'primary' : 'outline'} onPress={() => void updateLanguage('en')} />
        </View>
      </AppCard>
      <AppCard variant="outlined" style={styles.section}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <AppText variant="label" align="auto">{t('farha.phase1.settings.notifications')}</AppText>
            <AppText variant="caption" color={colors.textSecondary} align="auto">
              {t('farha.phase1.settings.notificationsBody')}
            </AppText>
          </View>
          <Switch value={controller.state.notificationsEnabled} onValueChange={controller.setNotificationsEnabled} />
        </View>
      </AppCard>
      <AppCard variant="outlined" style={styles.section}>
        <SectionHeader title={t('farha.phase1.settings.proStatus')} />
        <AppText variant="body2" align="auto">
          {controller.state.isPro ? t('farha.phase1.settings.proActive') : t('farha.phase1.settings.proFree')}
        </AppText>
        <AppButton
          label={controller.state.isPro ? t('farha.phase1.actions.restorePurchase') : t('farha.phase1.actions.upgrade')}
          onPress={() => controller.state.isPro ? controller.restorePurchase() : controller.navigate('ProUpgradeScreen', { from: 'SettingsScreen' })}
          fullWidth
        />
      </AppCard>
      <AppCard variant="outlined" style={styles.section}>
        <SectionHeader title={t('farha.phase1.settings.about')} />
        <AppText variant="body2" align="auto">{t('farha.phase1.settings.version')}</AppText>
      </AppCard>
      <AppButton
        label={t('farha.phase1.actions.clearAllData')}
        variant="danger"
        onPress={() => confirmAction(
          t('farha.phase1.confirm.clearAllData'),
          controller.clearAllData,
          t('farha.phase1.confirm.cancel'),
          t('farha.phase1.confirm.ok'),
        )}
        fullWidth
      />
    </ScreenFrame>
  );
}

interface FrameProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  controller?: Phase1PlannerController;
  showBack?: boolean;
  showTabs?: boolean;
  headerActions?: React.ReactNode;
}

function ScreenFrame({ title, subtitle, children, controller, showBack, showTabs, headerActions }: FrameProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createPhase1Styles(colors), [colors]);

  return (
    <AppScreenTemplate
      contentStyle={styles.screenContent}
      isLoading={controller?.status === 'loading'}
      isError={controller?.status === 'error'}
      errorMessage={controller?.errorMessageKey ? t(controller.errorMessageKey) : undefined}
      onRetry={controller?.reload}
      footer={showTabs && controller ? <BottomTabs controller={controller} /> : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={styles.rowText}>
              <AppText variant="h2" align="auto">{title}</AppText>
              {subtitle ? (
                <AppText variant="body2" color={colors.textSecondary} align="auto">{subtitle}</AppText>
              ) : null}
            </View>
            {showBack && controller ? (
              <AppButton label={t('farha.phase1.actions.back')} size="sm" variant="outline" onPress={controller.goBack} />
            ) : null}
          </View>
          {headerActions}
        </View>
        {children}
      </ScrollView>
    </AppScreenTemplate>
  );
}

function BottomTabs({ controller }: Phase1ScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createPhase1Styles(colors), [colors]);
  const tabs: Phase1TabKey[] = ['home', 'budget', 'checklist', 'settings'];

  return (
    <View style={styles.bottomTabs}>
      {tabs.map((tab) => {
        const active = tab === controller.activeTab;
        return (
          <AppPressable
            key={tab}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[styles.tabItem, { backgroundColor: active ? colors.primaryLight : 'transparent' }]}
            onPress={() => controller.openTab(tab)}
          >
            <AppText variant="caption" color={active ? colors.primaryDark : colors.textSecondary} align="center" numberOfLines={1}>
              {t(`farha.phase1.tabs.${tab}`)}
            </AppText>
          </AppPressable>
        );
      })}
    </View>
  );
}

function EventForm({ form, submitted, onChange }: {
  form: EventFormState;
  submitted: boolean;
  onChange: (form: EventFormState) => void;
}) {
  const { t } = useTranslation();
  const styles = useLocalStyles();
  const draft: EventFormDraft = { ...form };
  const validation = validateEventDraft(draft);

  return (
    <View style={styles.stack}>
      <SegmentedControl
        items={phase1EventTypes.map((type) => ({ key: type, label: t(`farha.phase1.events.${type}`) }))}
        activeKey={form.type}
        onChange={(type) => onChange({ ...form, type: type as FarhaPhase1EventType })}
      />
      <AppInput
        label={t('farha.phase1.labels.eventTitle')}
        placeholder={t('farha.phase1.eventCreate.titlePlaceholder')}
        value={form.title}
        onChangeText={(title) => onChange({ ...form, title })}
        error={submitted && validation.errors.title ? t('farha.phase1.validation.required') : undefined}
      />
      <AppInput
        label={t('farha.phase1.labels.eventDate')}
        placeholder={t('farha.phase1.labels.datePlaceholder')}
        value={form.date}
        onChangeText={(date) => onChange({ ...form, date })}
        error={submitted && validation.errors.date ? t('farha.phase1.validation.invalidDate') : undefined}
      />
    </View>
  );
}

function EventCard({ controller, event, onPress }: {
  controller: Phase1PlannerController;
  event: FarhaPhase1Event;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useLocalStyles();
  const totals = calculateBudgetTotals(controller.getEventBudgetItems(event.id));

  return (
    <AppCard variant="outlined" style={styles.section} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.rowText}>
          <AppText variant="h4" align="auto">{event.title}</AppText>
          <AppText variant="caption" color={colors.textSecondary} align="auto">
            {t(`farha.phase1.events.${event.type}`)} - {formatCountdown(t, event)}
          </AppText>
        </View>
        <AppBadge label={money(t, totals.actualTotal)} variant={totals.badge === 'over' ? 'warning' : 'success'} />
      </View>
    </AppCard>
  );
}

function BudgetSummaryCard({ title, totals, onPress }: {
  title: string;
  totals: ReturnType<typeof calculateBudgetTotals>;
  onPress?: () => void;
}) {
  const { t } = useTranslation();
  const styles = useLocalStyles();

  return (
    <AppCard variant="outlined" style={styles.section} onPress={onPress}>
      <SectionHeader title={title} />
      <View style={styles.metricGrid}>
        <Metric label={t('farha.phase1.labels.planned')} value={money(t, totals.plannedTotal)} />
        <Metric label={t('farha.phase1.labels.actual')} value={money(t, totals.actualTotal)} />
        <Metric label={t('farha.phase1.labels.deposits')} value={money(t, totals.depositTotal)} />
        <Metric label={t('farha.phase1.labels.balance')} value={money(t, totals.balanceTotal)} />
      </View>
      <BudgetBadge totals={totals} />
    </AppCard>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  const styles = useLocalStyles();

  return (
    <View style={styles.metric}>
      <AppText variant="caption" color={colors.textSecondary} align="auto">{label}</AppText>
      <AppText variant="h4" align="auto" numberOfLines={1}>{value}</AppText>
    </View>
  );
}

function BudgetBadge({ totals }: { totals: ReturnType<typeof calculateBudgetTotals> }) {
  const { t } = useTranslation();
  return (
    <AppBadge
      label={t(totals.badge === 'over' ? 'farha.phase1.budget.overBudget' : 'farha.phase1.budget.onBudget')}
      variant={totals.badge === 'over' ? 'warning' : 'success'}
    />
  );
}

function BudgetItemRow({ item, onPress }: { item: FarhaPhase1BudgetItem; onPress: () => void }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useLocalStyles();
  const status = getBudgetItemStatus(item);

  return (
    <AppPressable accessibilityRole="button" accessibilityLabel={item.name} style={styles.listRow} onPress={onPress}>
      <View style={styles.rowText}>
        <AppText variant="label" align="auto">{item.name}</AppText>
        <AppText variant="caption" color={colors.textSecondary} align="auto">
          {item.dueDate ?? t('farha.phase1.labels.noDueDate')}
        </AppText>
      </View>
      <View style={styles.rowSide}>
        <AppText variant="label" align="auto">{money(t, item.actualCost ?? item.plannedCost)}</AppText>
        <AppText variant="caption" color={colors.textSecondary} align="auto">
          {money(t, calculateItemBalance(item))}
        </AppText>
      </View>
      <AppBadge label={t(`farha.phase1.budget.status.${status}`)} variant={status === 'paid' ? 'success' : status === 'partial' ? 'warning' : 'neutral'} />
    </AppPressable>
  );
}

function ChecklistRow({ controller, item, onPress }: {
  controller: Phase1PlannerController;
  item: FarhaPhase1ChecklistItem;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useLocalStyles();
  const overdue = item.status === 'pending' && isOverdue(item.dueDate);

  return (
    <AppPressable accessibilityRole="button" accessibilityLabel={getChecklistTitle(t, item)} style={styles.listRow} onPress={onPress}>
      <View style={styles.rowText}>
        <AppText variant="label" align="auto">{getChecklistTitle(t, item)}</AppText>
        <AppText variant="caption" color={overdue ? colors.warning : colors.textSecondary} align="auto">
          {item.dueDate ?? t('farha.phase1.labels.noDueDate')}
        </AppText>
      </View>
      <AppBadge label={t(`farha.phase1.checklist.status.${item.status}`)} variant={item.status === 'done' ? 'success' : item.status === 'skipped' ? 'neutral' : overdue ? 'warning' : 'info'} />
      {item.status === 'pending' ? (
        <AppButton label={t('farha.phase1.checklist.markDoneShort')} size="sm" onPress={() => controller.setChecklistItemStatus(item.id, 'done')} />
      ) : null}
    </AppPressable>
  );
}

function CategorySelector({ controller, event, selectedCategoryId, onChange, allowNone }: {
  controller: Phase1PlannerController;
  event: FarhaPhase1Event;
  selectedCategoryId: string;
  onChange: (categoryId: string) => void;
  allowNone?: boolean;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useLocalStyles();
  const categories = controller.getEventCategories(event.id);

  return (
    <View style={styles.stack}>
      <AppText variant="label" align="auto">{t('farha.phase1.labels.linkedCategory')}</AppText>
      <View style={styles.wrapRow}>
        {allowNone ? (
          <ChoiceChip label={t('farha.phase1.labels.none')} selected={!selectedCategoryId} onPress={() => onChange('')} />
        ) : null}
        {categories.map((category) => (
          <ChoiceChip
            key={category.id}
            label={getCategoryName(t, category)}
            selected={category.id === selectedCategoryId}
            onPress={() => onChange(category.id)}
            selectedColor={colors.primaryLight}
          />
        ))}
      </View>
    </View>
  );
}

function ChoiceChip({ label, selected, onPress, selectedColor }: {
  label: string;
  selected: boolean;
  onPress: () => void;
  selectedColor?: string;
}) {
  const { colors } = useTheme();
  return (
    <AppPressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[
        {
          minHeight: 42,
          maxWidth: '48%',
          borderRadius: 999,
          borderWidth: 1,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderColor: selected ? colors.primary : colors.border,
          backgroundColor: selected ? selectedColor ?? colors.primaryLight : colors.surface,
          justifyContent: 'center',
        },
      ]}
      onPress={onPress}
    >
      <AppText variant="caption" align="center" color={selected ? colors.primaryDark : colors.text} numberOfLines={2}>{label}</AppText>
    </AppPressable>
  );
}

function AdBanner() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useLocalStyles();

  return (
    <View style={styles.adBanner}>
      <AppText variant="caption" color={colors.textSecondary} align="center">
        {t('farha.phase1.ads.banner')}
      </AppText>
    </View>
  );
}

function MissingEvent({ controller }: Phase1ScreenProps) {
  const { t } = useTranslation();
  return (
    <ScreenFrame title={t('farha.phase1.errors.missingEvent')} controller={controller} showBack>
      <AppButton label={t('farha.phase1.actions.createEvent')} onPress={() => controller.navigate('EventCreateScreen')} fullWidth />
    </ScreenFrame>
  );
}

function getScreenEvent(controller: Phase1PlannerController): FarhaPhase1Event | undefined {
  return controller.getEventById(controller.route.params?.eventId) ?? controller.activeEvent;
}

function useLocalStyles() {
  const { colors } = useTheme();
  return useMemo(() => createPhase1Styles(colors), [colors]);
}

function eventToForm(event?: FarhaPhase1Event): EventFormState {
  if (!event) return defaultEventForm;
  return { type: event.type, title: event.title, date: event.date };
}

function budgetItemToForm(item?: FarhaPhase1BudgetItem, category?: FarhaPhase1BudgetCategory): BudgetItemFormState {
  if (!item) {
    return { ...emptyBudgetItemForm, categoryId: category?.id ?? '' };
  }

  return {
    categoryId: item.categoryId,
    name: item.name,
    plannedCost: item.plannedCost ? String(item.plannedCost) : '',
    actualCost: typeof item.actualCost === 'number' ? String(item.actualCost) : '',
    depositPaid: item.depositPaid ? String(item.depositPaid) : '',
    dueDate: item.dueDate ?? '',
    notes: item.notes ?? '',
  };
}

function formToBudgetDraft(
  form: BudgetItemFormState,
  id: string | undefined,
  categoryId: string,
): BudgetItemDraft {
  return {
    id,
    categoryId,
    name: form.name,
    plannedCost: parseCurrencyInput(form.plannedCost) ?? Number.NaN,
    actualCost: parseCurrencyInput(form.actualCost),
    depositPaid: parseCurrencyInput(form.depositPaid) ?? 0,
    dueDate: form.dueDate,
    notes: form.notes,
  };
}

function checklistItemToForm(
  item?: FarhaPhase1ChecklistItem,
  t?: (key: string, options?: Record<string, unknown>) => string,
): ChecklistItemFormState {
  if (!item) return emptyChecklistItemForm;

  return {
    title: item.titleKey && t ? t(item.titleKey) : item.title,
    dueDate: item.dueDate ?? '',
    categoryId: item.categoryId ?? '',
    notes: item.notes ?? '',
  };
}

function getCategoryName(t: (key: string, options?: Record<string, unknown>) => string, category: FarhaPhase1BudgetCategory): string {
  return category.customName ?? (category.nameKey ? t(category.nameKey) : t('farha.phase1.categories.other'));
}

function getChecklistTitle(t: (key: string, options?: Record<string, unknown>) => string, item: FarhaPhase1ChecklistItem): string {
  return item.titleKey ? t(item.titleKey) : item.title;
}

function money(t: (key: string, options?: Record<string, unknown>) => string, amount: number): string {
  return `${formatCurrency(amount)} ${t('farha.phase1.currency')}`;
}

function formatCountdown(t: (key: string, options?: Record<string, unknown>) => string, event: FarhaPhase1Event): string {
  const days = getCountdownDays(event.date);
  if (days > 0) return t('farha.phase1.countdown.future', { count: days });
  if (days < 0) return t('farha.phase1.countdown.past', { count: Math.abs(days) });
  return t('farha.phase1.countdown.today');
}

function confirmAction(message: string, action: () => void, cancelLabel: string, okLabel: string) {
  Alert.alert('Farha', message, [
    { text: cancelLabel, style: 'cancel' },
    { text: okLabel, style: 'destructive', onPress: action },
  ]);
}

function getDefaultFutureDate(): string {
  const date = new Date();
  date.setMonth(date.getMonth() + 6);
  return date.toISOString().slice(0, 10);
}
