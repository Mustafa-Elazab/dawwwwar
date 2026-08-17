import {
  calculateBudgetHealth,
  calculateBudgetTotals,
  createEventWithSeeds,
  createInitialPhase1State,
  createSharePayload,
  deleteEventCascade,
  getChecklistSummary,
  getEventCategories,
  getEventTasks,
  getTaskPaymentStatus,
  logTaskPayment,
  migratePhase1State,
  resolveBootRoute,
  setNotificationsEnabled,
  setTaskStatus,
  upsertTask,
  validateTaskDraft,
} from '../src/core/planner/domain/phase1Logic';
import { standardChecklistTemplates } from '../src/core/planner/data/checklistTemplates';
import {
  createPhase1BillingClient,
  type Phase1BillingAdapter,
} from '../src/features/monetization/data/phase1Billing';
import type {
  FarhaPhase1EventType,
  OccasionFormDraft,
} from '../src/core/planner/domain/phase1Types';

describe('Farha Phase 1 planner logic', () => {
  const now = new Date('2026-08-02T09:00:00.000Z');
  const occasionDraft = (
    type: FarhaPhase1EventType,
    title: string,
    date: string,
    overrides: Partial<OccasionFormDraft> = {},
  ): OccasionFormDraft => ({
    type,
    title,
    date,
    categoryKeys: ['venue', 'dress', 'photoVideo', 'catering'],
    budgetSpent: 0,
    budgetAvailable: 0,
    budgetTarget: 0,
    ...overrides,
  });

  it('routes first launch, single occasion, and Pro multi-occasion state without onboarding gate', () => {
    const initial = createInitialPhase1State(now);
    expect(resolveBootRoute(initial).name).toBe('OccasionCreateScreen');

    const oneOccasion = createEventWithSeeds(initial, occasionDraft('wedding', 'Wedding', '2027-08-02'), now);
    expect(resolveBootRoute(oneOccasion).name).toBe('OccasionDashboardScreen');

    const twoOccasions = createEventWithSeeds(
      { ...oneOccasion, isPro: true },
      occasionDraft('graduation', 'Graduation', '2027-01-02'),
      now,
    );
    expect(resolveBootRoute(twoOccasions).name).toBe('OccasionListScreen');
  });

  it('seeds default task categories and graduation tasks', () => {
    const state = createEventWithSeeds(
      createInitialPhase1State(now),
      occasionDraft('graduation', 'Graduation', '2027-08-02'),
      now,
    );

    expect(getEventCategories(state, state.activeOccasionId)).toHaveLength(4);
    expect(getEventTasks(state, state.activeOccasionId).length).toBeLessThanOrEqual(
      standardChecklistTemplates.graduation?.length ?? 0,
    );
  });

  it('uses planned cost as the actual base when actual/quoted cost is absent', () => {
    const state = createEventWithSeeds(
      createInitialPhase1State(now),
      occasionDraft('engagement', 'Engagement', '2027-02-02'),
      now,
    );
    const withTask = upsertTask(state, {
      occasionId: state.activeOccasionId ?? '',
      title: 'Venue',
      category: 'venue',
      status: 'pending',
      plannedCost: 10000,
      depositPaid: 2500,
    }, now);

    expect(calculateBudgetTotals(getEventTasks(withTask, withTask.activeOccasionId))).toEqual({
      plannedTotal: 10000,
      actualTotal: 10000,
      depositTotal: 2500,
      balanceTotal: 7500,
      badge: 'on',
    });
  });

  it('derives task payment badges from deposits and remaining balance', () => {
    expect(getTaskPaymentStatus({ plannedCost: 100, depositPaid: 0 })).toBe('unpaid');
    expect(getTaskPaymentStatus({ plannedCost: 100, depositPaid: 40 })).toBe('partial');
    expect(getTaskPaymentStatus({ plannedCost: 100, actualCost: 90, depositPaid: 90 })).toBe('paid');
  });

  it('warns but does not block a deposit that exceeds the total', () => {
    const validation = validateTaskDraft({
      occasionId: 'occasion',
      title: 'Dress',
      status: 'pending',
      plannedCost: 1000,
      actualCost: undefined,
      depositPaid: 1200,
    });

    expect(validation.isValid).toBe(true);
    expect(validation.warnings.depositPaid).toBe('depositOverTotal');
  });

  it('excludes skipped tasks from completion denominator', () => {
    const state = createEventWithSeeds(
      createInitialPhase1State(now),
      occasionDraft('anniversary', 'Anniversary', '2027-01-02', { categoryKeys: ['venue', 'gifts'] }),
      now,
    );
    const items = getEventTasks(state, state.activeOccasionId);
    const withDone = setTaskStatus(state, items[0].id, 'done', now);
    const withSkipped = setTaskStatus(withDone, items[1].id, 'skipped', now);

    expect(getChecklistSummary(getEventTasks(withSkipped, withSkipped.activeOccasionId))).toMatchObject({
      doneCount: 1,
      actionableTotal: items.length - 1,
      skippedCount: 1,
    });
  });

  it('stores future task and payment-plan notification records and cancels them when reminders are disabled', () => {
    const state = createEventWithSeeds(
      createInitialPhase1State(now),
      occasionDraft('engagement', 'Engagement', '2027-02-02'),
      now,
    );
    const withPlan = upsertTask(state, {
      occasionId: state.activeOccasionId ?? '',
      title: 'Pay hall installment',
      category: 'venue',
      status: 'pending',
      plannedCost: 1000,
      depositPaid: 0,
      dueDate: '2026-09-02',
      paymentPlan: {
        monthlyAmount: 100,
        nextDueDate: '2026-09-02',
      },
    }, now);

    expect(withPlan.scheduledNotifications.length).toBeGreaterThan(state.scheduledNotifications.length);
    expect(setNotificationsEnabled(withPlan, false, now).scheduledNotifications).toHaveLength(0);
  });

  it('logs a monthly payment, advances next due date, and stops reminders when paid off', () => {
    const state = createEventWithSeeds(
      createInitialPhase1State(now),
      occasionDraft('wedding', 'Wedding', '2027-08-02'),
      now,
    );
    const withPlan = upsertTask(state, {
      occasionId: state.activeOccasionId ?? '',
      title: 'Dress',
      category: 'dress',
      status: 'pending',
      plannedCost: 200,
      depositPaid: 0,
      paymentPlan: {
        monthlyAmount: 100,
        nextDueDate: '2026-08-15',
      },
    }, now);
    const task = getEventTasks(withPlan, withPlan.activeOccasionId).find((item) => item.title === 'Dress');
    const partiallyPaid = logTaskPayment(withPlan, {
      taskId: task?.id ?? '',
      amount: 100,
      paidAt: '2026-08-15',
    }, now);
    const updated = getEventTasks(partiallyPaid, partiallyPaid.activeOccasionId).find((item) => item.id === task?.id);
    expect(updated?.depositPaid).toBe(100);
    expect(updated?.paymentPlan?.nextDueDate).toBe('2026-09-15');

    const paidOff = logTaskPayment(partiallyPaid, {
      taskId: task?.id ?? '',
      amount: 100,
      paidAt: '2026-09-15',
    }, now);
    const paidTask = getEventTasks(paidOff, paidOff.activeOccasionId).find((item) => item.id === task?.id);
    expect(paidTask?.paymentPlan).toBeUndefined();
  });

  it('migrates legacy budget and checklist rows into unified tasks', () => {
    const migrated = migratePhase1State({
      hasOnboarded: true,
      activeEventId: 'event-1',
      events: [{
        id: 'event-1',
        type: 'wedding',
        title: 'Wedding',
        date: '2027-01-01',
        categoryKeys: ['venue'],
        budgetSpent: 0,
        budgetAvailable: 0,
        budgetTarget: 0,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      }],
      budgetCategories: [{
        id: 'cat-1',
        eventId: 'event-1',
        key: 'venue',
        nameKey: 'farha.phase1.categories.venue',
        isDefault: true,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      }],
      budgetItems: [{
        id: 'budget-1',
        categoryId: 'cat-1',
        name: 'Book the hall',
        plannedCost: 1000,
        depositPaid: 200,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      }],
      checklistItems: [{
        id: 'task-1',
        eventId: 'event-1',
        categoryId: 'cat-1',
        title: 'Book the hall',
        status: 'pending',
        source: 'custom',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      }],
    }, now);

    expect(migrated.occasions).toHaveLength(1);
    expect(migrated.tasks).toHaveLength(1);
    expect(migrated.tasks[0]).toMatchObject({
      category: 'venue',
      plannedCost: 1000,
      depositPaid: 200,
    });
  });

  it('cascades occasion deletion through tasks and notifications', () => {
    const state = createEventWithSeeds(
      createInitialPhase1State(now),
      occasionDraft('wedding', 'Wedding', '2027-08-02'),
      now,
    );
    const deleted = deleteEventCascade(state, state.activeOccasionId ?? '', now);

    expect(deleted.occasions).toHaveLength(0);
    expect(deleted.tasks).toHaveLength(0);
    expect(deleted.scheduledNotifications).toHaveLength(0);
  });

  it('generates a share payload with occasion, task progress, money totals, and Farha mark', () => {
    const state = createEventWithSeeds(
      createInitialPhase1State(now),
      occasionDraft('wedding', 'Family Wedding', '2027-08-02', {
        budgetSpent: 1000,
        budgetAvailable: 5000,
        budgetTarget: 6000,
      }),
      now,
    );

    expect(createSharePayload(state, state.activeOccasionId ?? '')).toContain('Family Wedding');
    expect(createSharePayload(state, state.activeOccasionId ?? '')).toContain('Tasks:');
    expect(createSharePayload(state, state.activeOccasionId ?? '')).toContain('Made with Farha');
  });

  it('computes budget health from occasion money fields and unpaid task balances', () => {
    const state = createEventWithSeeds(
      createInitialPhase1State(now),
      occasionDraft('wedding', 'Wedding', '2027-08-02', {
        budgetSpent: 1000,
        budgetAvailable: 3000,
        budgetTarget: 5000,
      }),
      now,
    );
    const withTask = upsertTask(state, {
      occasionId: state.activeOccasionId ?? '',
      title: 'Venue',
      category: 'venue',
      status: 'pending',
      plannedCost: 2000,
      depositPaid: 0,
    }, now);
    const occasion = withTask.occasions[0];

    expect(calculateBudgetHealth(occasion, getEventTasks(withTask, occasion.id))).toMatchObject({
      spentTotal: 1000,
      availableTotal: 3000,
      targetTotal: 5000,
      plannedRemaining: 4000,
      availableAfterPlanned: -1000,
      status: 'watch',
    });
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
