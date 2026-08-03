import {
  addBudgetCategory,
  calculateFundBalance,
  calculateBudgetTotals,
  confirmSavingsAllocations,
  createEventWithSeeds,
  createInitialPhase1State,
  createSharePayload,
  deleteEventCascade,
  getBudgetItemStatus,
  getChecklistSummary,
  getEventSavingsContributions,
  getEventBudgetItems,
  getEventCategories,
  getEventChecklistItems,
  getSavingsSummary,
  resolveBootRoute,
  setChecklistStatus,
  setSavingsMonthlyGoal,
  setNotificationsEnabled,
  suggestSavingsAllocations,
  upsertChecklistItem,
  upsertPhase1BudgetItem,
  upsertSavingsContribution,
  validateBudgetItemDraft,
} from '../src/core/planner/domain/phase1Logic';
import { defaultPhase1BudgetCategories } from '../src/core/planner/data/defaultBudgetCategories';
import { standardChecklistTemplates } from '../src/core/planner/data/checklistTemplates';
import {
  createPhase1BillingClient,
  type Phase1BillingAdapter,
} from '../src/features/monetization/data/phase1Billing';

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
    expect(deleted.savingsContributions).toHaveLength(0);
    expect(deleted.savingsAllocations).toHaveLength(0);
    expect(deleted.scheduledNotifications).toHaveLength(0);
  });

  it('tracks savings balance, monthly goal progress, and newest contribution first', () => {
    const state = createEventWithSeeds(createInitialPhase1State(now), {
      type: 'wedding',
      title: 'Wedding',
      date: '2027-08-02',
    }, now);
    const withGoal = setSavingsMonthlyGoal(state, state.activeEventId ?? '', 5000, now);
    const first = upsertSavingsContribution(withGoal, {
      eventId: withGoal.activeEventId ?? '',
      amount: 1000,
      date: '2026-08-02',
    }, new Date('2026-08-02T10:00:00.000Z'));
    const second = upsertSavingsContribution(first, {
      eventId: first.activeEventId ?? '',
      amount: 2500,
      date: '2026-08-03',
      note: 'Family help',
    }, new Date('2026-08-03T10:00:00.000Z'));

    expect(calculateFundBalance(second, second.activeEventId)).toBe(3500);
    expect(getSavingsSummary(second, second.activeEventId, now)).toMatchObject({
      balance: 3500,
      contributedThisMonth: 3500,
      monthlyGoal: 5000,
      monthlyProgress: 0.7,
    });
    expect(getEventSavingsContributions(second, second.activeEventId)[0]).toMatchObject({
      amount: 2500,
      note: 'Family help',
    });
  });

  it('suggests savings allocation by due date and updates budget deposits with audit rows', () => {
    const state = createEventWithSeeds(createInitialPhase1State(now), {
      type: 'wedding',
      title: 'Wedding',
      date: '2027-08-02',
    }, now);
    const category = getEventCategories(state, state.activeEventId)[0];
    const firstItemState = upsertPhase1BudgetItem(state, {
      categoryId: category.id,
      name: 'Later item',
      plannedCost: 4000,
      depositPaid: 0,
      dueDate: '2026-09-01',
    }, now);
    const secondItemState = upsertPhase1BudgetItem(firstItemState, {
      categoryId: category.id,
      name: 'Soon item',
      plannedCost: 3000,
      depositPaid: 500,
      dueDate: '2026-08-15',
    }, new Date('2026-08-02T09:01:00.000Z'));
    const funded = upsertSavingsContribution(secondItemState, {
      eventId: secondItemState.activeEventId ?? '',
      amount: 5000,
      date: '2026-08-02',
    }, new Date('2026-08-02T09:02:00.000Z'));
    const suggestion = suggestSavingsAllocations(funded, funded.activeEventId ?? '');
    const allocated = confirmSavingsAllocations(
      funded,
      funded.activeEventId ?? '',
      suggestion,
      new Date('2026-08-02T09:03:00.000Z'),
    );

    expect(suggestion.map((item) => item.amount)).toEqual([2500, 2500]);
    expect(allocated.savingsAllocations).toHaveLength(2);
    expect(calculateFundBalance(allocated, allocated.activeEventId)).toBe(0);
    expect(calculateBudgetTotals(getEventBudgetItems(allocated, allocated.activeEventId))).toMatchObject({
      depositTotal: 5500,
      balanceTotal: 1500,
    });
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

  it('keeps Phase 1 Pro purchase and restore behind a Play Billing adapter', async () => {
    const fakeAdapter: Phase1BillingAdapter = {
      initConnection: async () => true,
      fetchProducts: async () => [],
      requestPurchase: async () => {
        setTimeout(() => {
          purchaseListener?.({
            productId: 'farha_pro_lifetime',
          } as Parameters<Parameters<Phase1BillingAdapter['purchaseUpdatedListener']>[0]>[0]);
        }, 0);
      },
      purchaseUpdatedListener: (listener) => {
        purchaseListener = listener;
        return { remove: jest.fn() };
      },
      purchaseErrorListener: () => ({ remove: jest.fn() }),
      finishTransaction: async () => true,
      getAvailablePurchases: async () => [{
        productId: 'farha_pro_lifetime',
      } as Awaited<ReturnType<Phase1BillingAdapter['getAvailablePurchases']>>[number]],
    };
    let purchaseListener:
      | Parameters<Phase1BillingAdapter['purchaseUpdatedListener']>[0]
      | undefined;
    const billingClient = createPhase1BillingClient(async () => fakeAdapter);

    await expect(billingClient.purchasePro()).resolves.toEqual({
      entitled: true,
      source: 'playBilling',
    });
    await expect(billingClient.restorePro()).resolves.toEqual({
      entitled: true,
      source: 'playBilling',
    });
  });
});
