import {
  addBudgetCategory,
  calculateBudgetTotals,
  createEventWithSeeds,
  createInitialPhase1State,
  createSharePayload,
  deleteEventCascade,
  getBudgetItemStatus,
  getChecklistSummary,
  getEventBudgetItems,
  getEventCategories,
  getEventChecklistItems,
  resolveBootRoute,
  setChecklistStatus,
  setNotificationsEnabled,
  upsertChecklistItem,
  upsertPhase1BudgetItem,
  validateBudgetItemDraft,
} from '../src/features/planner/domain/phase1Logic';
import { defaultPhase1BudgetCategories } from '../src/features/planner/data/defaultBudgetCategories';
import { standardChecklistTemplates } from '../src/features/planner/data/checklistTemplates';
import { createPhase1BillingClient } from '../src/features/monetization/data/phase1Billing';

describe('Farha Phase 1 planner logic', () => {
  const now = new Date('2026-08-02T09:00:00.000Z');

  it('routes first launch, empty onboarded state, single event, and Pro multi-event state', () => {
    const initial = createInitialPhase1State(now);
    expect(resolveBootRoute(initial).name).toBe('OnboardingWelcomeScreen');

    const onboarded = { ...initial, hasOnboarded: true };
    expect(resolveBootRoute(onboarded).name).toBe('EventCreateScreen');

    const oneEvent = createEventWithSeeds(onboarded, {
      type: 'wedding',
      title: 'Wedding',
      date: '2027-08-02',
    }, now);
    expect(resolveBootRoute(oneEvent).name).toBe('EventDashboardScreen');

    const twoEvents = createEventWithSeeds({ ...oneEvent, isPro: true }, {
      type: 'engagement',
      title: 'Engagement',
      date: '2027-01-02',
    }, now);
    expect(resolveBootRoute(twoEvents).name).toBe('EventListScreen');
  });

  it('seeds all default budget categories and the exact wedding checklist template', () => {
    const state = createEventWithSeeds(createInitialPhase1State(now), {
      type: 'wedding',
      title: 'Wedding',
      date: '2027-08-02',
    }, now);

    expect(getEventCategories(state, state.activeEventId)).toHaveLength(defaultPhase1BudgetCategories.length);
    expect(getEventChecklistItems(state, state.activeEventId)).toHaveLength(
      standardChecklistTemplates.wedding?.length,
    );
  });

  it('uses planned cost as the actual base when actual/quoted cost is absent', () => {
    const state = createEventWithSeeds(createInitialPhase1State(now), {
      type: 'engagement',
      title: 'Engagement',
      date: '2027-02-02',
    }, now);
    const category = getEventCategories(state, state.activeEventId)[0];
    const withItem = upsertPhase1BudgetItem(state, {
      categoryId: category.id,
      name: 'Venue',
      plannedCost: 10000,
      depositPaid: 2500,
    }, now);

    expect(calculateBudgetTotals(getEventBudgetItems(withItem, withItem.activeEventId))).toEqual({
      plannedTotal: 10000,
      actualTotal: 10000,
      depositTotal: 2500,
      balanceTotal: 7500,
      badge: 'on',
    });
  });

  it('derives item payment badges from deposits and remaining balance', () => {
    expect(getBudgetItemStatus({ plannedCost: 100, depositPaid: 0 })).toBe('unpaid');
    expect(getBudgetItemStatus({ plannedCost: 100, depositPaid: 40 })).toBe('partial');
    expect(getBudgetItemStatus({ plannedCost: 100, actualCost: 90, depositPaid: 90 })).toBe('paid');
  });

  it('warns but does not block a deposit that exceeds the total', () => {
    const validation = validateBudgetItemDraft({
      categoryId: 'category',
      name: 'Dress',
      plannedCost: 1000,
      actualCost: undefined,
      depositPaid: 1200,
    });

    expect(validation.isValid).toBe(true);
    expect(validation.warnings.depositPaid).toBe('depositOverTotal');
  });

  it('excludes skipped checklist items from completion denominator', () => {
    const state = createEventWithSeeds(createInitialPhase1State(now), {
      type: 'anniversary',
      title: 'Anniversary',
      date: '2027-01-02',
    }, now);
    const items = getEventChecklistItems(state, state.activeEventId);
    const withDone = setChecklistStatus(state, items[0].id, 'done', now);
    const withSkipped = setChecklistStatus(withDone, items[1].id, 'skipped', now);

    expect(getChecklistSummary(getEventChecklistItems(withSkipped, withSkipped.activeEventId))).toMatchObject({
      doneCount: 1,
      actionableTotal: items.length - 1,
      skippedCount: 1,
    });
  });

  it('stores edited template checklist titles as custom text', () => {
    const state = createEventWithSeeds(createInitialPhase1State(now), {
      type: 'engagement',
      title: 'Engagement',
      date: '2027-02-02',
    }, now);
    const templateItem = getEventChecklistItems(state, state.activeEventId)[0];
    const edited = upsertChecklistItem(state, {
      id: templateItem.id,
      eventId: templateItem.eventId,
      categoryId: templateItem.categoryId,
      title: 'Agree final celebration budget',
      dueDate: templateItem.dueDate,
      notes: 'Family-approved number',
    }, now);
    const updatedItem = getEventChecklistItems(edited, edited.activeEventId)
      .find((item) => item.id === templateItem.id);

    expect(updatedItem).toMatchObject({
      title: 'Agree final celebration budget',
      titleKey: undefined,
      source: 'template',
      status: 'pending',
    });
  });

  it('stores future notification records and cancels them when reminders are disabled', () => {
    const state = createEventWithSeeds(createInitialPhase1State(now), {
      type: 'engagement',
      title: 'Engagement',
      date: '2027-02-02',
    }, now);

    expect(state.scheduledNotifications.length).toBeGreaterThan(0);
    expect(setNotificationsEnabled(state, false, now).scheduledNotifications).toHaveLength(0);
  });

  it('cascades event deletion through budget, checklist, and notification records', () => {
    const eventState = createEventWithSeeds(createInitialPhase1State(now), {
      type: 'wedding',
      title: 'Wedding',
      date: '2027-08-02',
    }, now);
    const withCustomCategory = addBudgetCategory(eventState, {
      eventId: eventState.activeEventId ?? '',
      name: 'Custom',
    }, now);
    const category = getEventCategories(withCustomCategory, withCustomCategory.activeEventId)[0];
    const withItem = upsertPhase1BudgetItem(withCustomCategory, {
      categoryId: category.id,
      name: 'Hall',
      plannedCost: 50000,
      actualCost: 60000,
      depositPaid: 10000,
    }, now);
    const deleted = deleteEventCascade(withItem, withItem.activeEventId ?? '', now);

    expect(deleted.events).toHaveLength(0);
    expect(deleted.budgetCategories).toHaveLength(0);
    expect(deleted.budgetItems).toHaveLength(0);
    expect(deleted.checklistItems).toHaveLength(0);
    expect(deleted.scheduledNotifications).toHaveLength(0);
  });

  it('generates a share payload with event, budget, checklist, and Farha mark', () => {
    const state = createEventWithSeeds(createInitialPhase1State(now), {
      type: 'wedding',
      title: 'Family Wedding',
      date: '2027-08-02',
    }, now);

    expect(createSharePayload(state, state.activeEventId ?? '')).toContain('Family Wedding');
    expect(createSharePayload(state, state.activeEventId ?? '')).toContain('Made with Farha');
  });

  it('keeps Phase 1 Pro purchase and restore behind a replaceable billing client', async () => {
    const billingClient = createPhase1BillingClient();

    await expect(billingClient.purchasePro()).resolves.toEqual({
      entitled: true,
      source: 'localMock',
    });
    await expect(billingClient.restorePro()).resolves.toEqual({
      entitled: true,
      source: 'localMock',
    });
  });
});
