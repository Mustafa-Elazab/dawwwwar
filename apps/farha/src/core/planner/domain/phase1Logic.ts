import { defaultPhase1BudgetCategories } from '../data/defaultBudgetCategories';
import { standardChecklistTemplates } from '../data/checklistTemplates';
import type {
  BudgetBadgeStatus,
  BudgetCategoryDraft,
  BudgetHealth,
  BudgetItemDraft,
  BudgetItemPaymentStatus,
  BudgetTotals,
  ChecklistItemDraft,
  ChecklistStatus,
  ChecklistSummary,
  EventFormDraft,
  FarhaPhase1BudgetCategory,
  FarhaPhase1BudgetItem,
  FarhaPhase1Event,
  FarhaPhase1EventType,
  FarhaPhase1Occasion,
  FarhaPhase1ScheduledNotification,
  FarhaPhase1State,
  FarhaPhase1Task,
  FarhaPhase1WalkthroughStep,
  FarhaPhase1TaskCategoryKey,
  LegacyPhase1State,
  OccasionFormDraft,
  Phase1Route,
  SavingsAllocationInput,
  SavingsContributionDraft,
  SavingsSummary,
  TaskDraft,
  TaskPaymentInput,
  TaskPaymentStatus,
  TaskSummary,
  ValidationResult,
} from './phase1Types';

export const FARHA_PHASE1_SCHEMA_VERSION = 2;

export const phase1WalkthroughSteps: FarhaPhase1WalkthroughStep[] = [
  'createEvent',
  'eventCategories',
  'eventBudget',
  'dashboardOverview',
  'tasksTab',
  'addTask',
  'taskForm',
  'completed',
];

export const phase1EventTypes: FarhaPhase1EventType[] = [
  'engagement',
  'wedding',
  'anniversary',
  'graduation',
  'other',
];

export const phase1TaskCategories: FarhaPhase1TaskCategoryKey[] =
  defaultPhase1BudgetCategories.map((category) => category.key);

export const createInitialPhase1State = (now = new Date()): FarhaPhase1State => ({
  schemaVersion: FARHA_PHASE1_SCHEMA_VERSION,
  hasOnboarded: true,
  isPro: false,
  notificationsEnabled: true,
  occasions: [],
  tasks: [],
  scheduledNotifications: [],
  walkthroughStep: 'createEvent',
  updatedAt: now.toISOString(),
});

export const migratePhase1State = (
  rawState: Partial<LegacyPhase1State | FarhaPhase1State>,
  now = new Date(),
): FarhaPhase1State => {
  const fallback = createInitialPhase1State(now);
  const state = rawState as LegacyPhase1State & Partial<FarhaPhase1State>;
  const occasions = normalizeOccasions(state.occasions ?? state.events ?? []);
  const activeOccasionId = normalizeActiveOccasionId(
    state.activeOccasionId ?? state.activeEventId,
    occasions,
  );
  const tasks = state.tasks?.length
    ? normalizeTasks(state.tasks, occasions)
    : migrateLegacyTasks(state, occasions, now);

  return {
    schemaVersion: FARHA_PHASE1_SCHEMA_VERSION,
    hasOnboarded: state.hasOnboarded ?? fallback.hasOnboarded,
    isPro: state.isPro ?? fallback.isPro,
    notificationsEnabled: state.notificationsEnabled ?? fallback.notificationsEnabled,
    activeOccasionId,
    occasions,
    tasks,
    scheduledNotifications: normalizeNotifications(state.scheduledNotifications ?? [], tasks),
    walkthroughStep: normalizeWalkthroughStep(state.walkthroughStep),
    lastInterstitialShownAt: state.lastInterstitialShownAt,
    updatedAt: state.updatedAt ?? fallback.updatedAt,
  };
};

export const resolveBootRoute = (state: FarhaPhase1State): Phase1Route => {
  if (!state.occasions.length) return { name: 'OccasionCreateScreen' };
  if (state.occasions.length === 1 || !state.isPro) {
    return {
      name: 'OccasionDashboardScreen',
      params: { occasionId: state.activeOccasionId ?? state.occasions[0].id, tab: 'home' },
    };
  }
  return { name: 'OccasionListScreen' };
};

export const completeOnboarding = (
  state: FarhaPhase1State,
  now = new Date(),
): FarhaPhase1State => ({
  ...state,
  hasOnboarded: true,
  updatedAt: now.toISOString(),
});

export const createEventWithSeeds = (
  state: FarhaPhase1State,
  draft: EventFormDraft,
  now = new Date(),
): FarhaPhase1State => createOccasionWithSeeds(state, draft, now);

export const createOccasionWithSeeds = (
  state: FarhaPhase1State,
  draft: OccasionFormDraft,
  now = new Date(),
): FarhaPhase1State => {
  const timestamp = now.toISOString();
  const occasion: FarhaPhase1Occasion = {
    id: createId(`occasion-${draft.type}`, now),
    type: draft.type,
    title: draft.title.trim(),
    date: draft.date,
    categoryKeys: normalizeCategoryKeys(draft.categoryKeys),
    budgetSpent: draft.budgetSpent,
    budgetAvailable: draft.budgetAvailable,
    budgetTarget: draft.budgetTarget,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  const seededTasks = seedTasks(occasion, now).filter(
    (task) => !task.category || occasion.categoryKeys.includes(task.category),
  );
  const nextState: FarhaPhase1State = {
    ...state,
    hasOnboarded: true,
    activeOccasionId: occasion.id,
    occasions: [...state.occasions, occasion],
    tasks: [...state.tasks, ...seededTasks],
    walkthroughStep: getPostCreateWalkthroughStep(state.walkthroughStep),
    updatedAt: timestamp,
  };

  return {
    ...nextState,
    scheduledNotifications: refreshTaskNotifications(nextState, occasion.id, now),
  };
};

export const updateEventWithTemplateDueDates = (
  state: FarhaPhase1State,
  draft: EventFormDraft,
  now = new Date(),
): FarhaPhase1State => updateOccasionWithTemplateDueDates(state, draft, now);

export const updateOccasionWithTemplateDueDates = (
  state: FarhaPhase1State,
  draft: OccasionFormDraft,
  now = new Date(),
): FarhaPhase1State => {
  if (!draft.id) return state;
  const timestamp = now.toISOString();
  const occasion = getOccasionById(state, draft.id);
  if (!occasion) return state;

  const updatedOccasion: FarhaPhase1Occasion = {
    ...occasion,
    type: draft.type,
    title: draft.title.trim(),
    date: draft.date,
    categoryKeys: normalizeCategoryKeys(draft.categoryKeys),
    budgetSpent: draft.budgetSpent,
    budgetAvailable: draft.budgetAvailable,
    budgetTarget: draft.budgetTarget,
    updatedAt: timestamp,
  };
  const tasks = state.tasks.map((task) => {
    if (
      task.occasionId !== updatedOccasion.id ||
      task.source !== 'template' ||
      task.status !== 'pending' ||
      typeof task.offsetDaysBeforeOccasion !== 'number'
    ) {
      return task;
    }

    return {
      ...task,
      dueDate: subtractDays(updatedOccasion.date, task.offsetDaysBeforeOccasion),
      updatedAt: timestamp,
    };
  });
  const nextState: FarhaPhase1State = {
    ...state,
    activeOccasionId: updatedOccasion.id,
    occasions: state.occasions.map((candidate) =>
      candidate.id === updatedOccasion.id ? updatedOccasion : candidate,
    ),
    tasks,
    updatedAt: timestamp,
  };

  return {
    ...nextState,
    scheduledNotifications: refreshTaskNotifications(nextState, updatedOccasion.id, now),
  };
};

export const deleteEventCascade = (
  state: FarhaPhase1State,
  occasionId: string,
  now = new Date(),
): FarhaPhase1State => {
  const remainingOccasions = state.occasions.filter((occasion) => occasion.id !== occasionId);
  const nextActiveOccasionId = state.activeOccasionId === occasionId
    ? remainingOccasions[0]?.id
    : state.activeOccasionId;

  return {
    ...state,
    activeOccasionId: nextActiveOccasionId,
    occasions: remainingOccasions,
    tasks: state.tasks.filter((task) => task.occasionId !== occasionId),
    scheduledNotifications: state.scheduledNotifications.filter(
      (notification) => notification.occasionId !== occasionId,
    ),
    updatedAt: now.toISOString(),
  };
};

export const setActiveEvent = (
  state: FarhaPhase1State,
  occasionId: string,
  now = new Date(),
): FarhaPhase1State => ({
  ...state,
  activeOccasionId: occasionId,
  updatedAt: now.toISOString(),
});

export const upsertTask = (
  state: FarhaPhase1State,
  draft: TaskDraft,
  now = new Date(),
): FarhaPhase1State => {
  const timestamp = now.toISOString();
  const normalizedDraft = normalizeTaskDraft(draft);
  const occasion = getOccasionById(state, draft.occasionId);
  if (!occasion) return state;

  const tasks = draft.id
    ? state.tasks.map((task) =>
        task.id === draft.id
          ? {
              ...task,
              ...normalizedDraft,
              titleKey: undefined,
              updatedAt: timestamp,
            }
          : task,
      )
    : [
        ...state.tasks,
        {
          id: createId('task', now),
          ...normalizedDraft,
          source: 'custom' as const,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ];

  const nextState: FarhaPhase1State = {
    ...state,
    tasks,
    lastInterstitialShownAt: hasTaskCost(normalizedDraft) && shouldRecordInterstitial(state, now)
      ? timestamp
      : state.lastInterstitialShownAt,
    updatedAt: timestamp,
  };

  return {
    ...nextState,
    scheduledNotifications: refreshTaskNotifications(nextState, occasion.id, now),
  };
};

export const setTaskStatus = (
  state: FarhaPhase1State,
  taskId: string,
  status: ChecklistStatus,
  now = new Date(),
): FarhaPhase1State => {
  const timestamp = now.toISOString();
  const task = getTaskById(state, taskId);
  const tasks = state.tasks.map((candidate) =>
    candidate.id === taskId ? { ...candidate, status, updatedAt: timestamp } : candidate,
  );
  const nextState = { ...state, tasks, updatedAt: timestamp };

  return task
    ? { ...nextState, scheduledNotifications: refreshTaskNotifications(nextState, task.occasionId, now) }
    : nextState;
};

export const logTaskPayment = (
  state: FarhaPhase1State,
  input: TaskPaymentInput,
  now = new Date(),
): FarhaPhase1State => {
  const timestamp = now.toISOString();
  const task = getTaskById(state, input.taskId);
  if (!task || input.amount <= 0) return state;

  const nextDeposit = task.depositPaid + input.amount;
  const nextPlan = task.paymentPlan && calculateTaskBalance({ ...task, depositPaid: nextDeposit }) > 0
    ? {
        ...task.paymentPlan,
        nextDueDate: addMonths(input.paidAt ?? task.paymentPlan.nextDueDate, 1),
      }
    : undefined;
  const tasks = state.tasks.map((candidate) =>
    candidate.id === input.taskId
      ? {
          ...candidate,
          depositPaid: nextDeposit,
          paymentPlan: nextPlan,
          updatedAt: timestamp,
        }
      : candidate,
  );
  const nextState = { ...state, tasks, updatedAt: timestamp };

  return {
    ...nextState,
    scheduledNotifications: refreshTaskNotifications(nextState, task.occasionId, now),
  };
};

export const deleteTask = (
  state: FarhaPhase1State,
  taskId: string,
  now = new Date(),
): FarhaPhase1State => {
  const task = getTaskById(state, taskId);
  const nextState = {
    ...state,
    tasks: state.tasks.filter((candidate) => candidate.id !== taskId),
    scheduledNotifications: state.scheduledNotifications.filter(
      (notification) => notification.taskId !== taskId,
    ),
    updatedAt: now.toISOString(),
  };

  return task
    ? { ...nextState, scheduledNotifications: refreshTaskNotifications(nextState, task.occasionId, now) }
    : nextState;
};

export const setProStatus = (
  state: FarhaPhase1State,
  isPro: boolean,
  now = new Date(),
): FarhaPhase1State => ({
  ...state,
  isPro,
  updatedAt: now.toISOString(),
});

export const setNotificationsEnabled = (
  state: FarhaPhase1State,
  enabled: boolean,
  now = new Date(),
): FarhaPhase1State => {
  const nextState = {
    ...state,
    notificationsEnabled: enabled,
    scheduledNotifications: [],
    updatedAt: now.toISOString(),
  };

  if (!enabled) return nextState;

  return {
    ...nextState,
    scheduledNotifications: state.occasions.flatMap((occasion) =>
      refreshTaskNotifications(nextState, occasion.id, now),
    ),
  };
};

export const setWalkthroughStep = (
  state: FarhaPhase1State,
  step: FarhaPhase1WalkthroughStep,
  now = new Date(),
): FarhaPhase1State => ({
  ...state,
  walkthroughStep: step,
  updatedAt: now.toISOString(),
});

export const advanceWalkthrough = (
  state: FarhaPhase1State,
  nextStep?: FarhaPhase1WalkthroughStep,
  now = new Date(),
): FarhaPhase1State =>
  setWalkthroughStep(state, nextStep ?? getNextWalkthroughStep(state.walkthroughStep), now);

export const skipWalkthrough = (
  state: FarhaPhase1State,
  now = new Date(),
): FarhaPhase1State => setWalkthroughStep(state, 'completed', now);

export const restartWalkthrough = (
  state: FarhaPhase1State,
  now = new Date(),
): FarhaPhase1State =>
  setWalkthroughStep(state, state.occasions.length ? 'dashboardOverview' : 'createEvent', now);

export const clearAllPhase1Data = (now = new Date()): FarhaPhase1State =>
  createInitialPhase1State(now);

export const getOccasionById = (
  state: FarhaPhase1State,
  occasionId?: string,
): FarhaPhase1Occasion | undefined =>
  state.occasions.find((occasion) => occasion.id === occasionId);

export const getEventById = getOccasionById;

export const getActiveEvent = (state: FarhaPhase1State): FarhaPhase1Event | undefined =>
  getOccasionById(state, state.activeOccasionId) ?? state.occasions[0];

export const getEventTasks = (
  state: FarhaPhase1State,
  occasionId?: string,
): FarhaPhase1Task[] =>
  state.tasks
    .filter((task) => task.occasionId === occasionId)
    .sort(compareTasks);

export const getTaskById = (
  state: FarhaPhase1State,
  taskId?: string,
): FarhaPhase1Task | undefined =>
  state.tasks.find((task) => task.id === taskId);

export const calculateTaskBalance = (
  task: Pick<FarhaPhase1Task, 'plannedCost' | 'actualCost' | 'depositPaid'>,
): number =>
  Math.max(getTaskActualBase(task) - task.depositPaid, 0);

export const getTaskActualBase = (
  task: Pick<FarhaPhase1Task, 'plannedCost' | 'actualCost'>,
): number => task.actualCost ?? task.plannedCost ?? 0;

export const getTaskPaymentStatus = (
  task: Pick<FarhaPhase1Task, 'plannedCost' | 'actualCost' | 'depositPaid'>,
): TaskPaymentStatus => {
  if (!hasTaskCost(task) || task.depositPaid <= 0) return 'unpaid';
  if (calculateTaskBalance(task) <= 0) return 'paid';
  return 'partial';
};

export const getBudgetItemStatus = getTaskPaymentStatus;
export const calculateItemBalance = calculateTaskBalance;
export const getBudgetActualBase = getTaskActualBase;

export const calculateBudgetTotals = (tasks: FarhaPhase1Task[]): BudgetTotals => {
  const costedTasks = tasks.filter(hasTaskCost);
  const plannedTotal = sumBy(costedTasks, (task) => task.plannedCost ?? 0);
  const actualTotal = sumBy(costedTasks, getTaskActualBase);
  const depositTotal = sumBy(costedTasks, (task) => task.depositPaid);
  const balanceTotal = sumBy(costedTasks, calculateTaskBalance);

  return {
    plannedTotal,
    actualTotal,
    depositTotal,
    balanceTotal,
    badge: actualTotal > plannedTotal ? 'over' : 'on',
  };
};

export const calculateBudgetHealth = (
  occasion: FarhaPhase1Occasion,
  tasks: FarhaPhase1Task[],
): BudgetHealth => {
  const totals = calculateBudgetTotals(tasks);
  const spentTotal = occasion.budgetSpent + totals.depositTotal;
  const plannedTotal = Math.max(occasion.budgetTarget, totals.actualTotal);
  const plannedRemaining = Math.max(plannedTotal - spentTotal, 0);
  const availableAfterPlanned = occasion.budgetAvailable - plannedRemaining;
  const spentProgress = plannedTotal > 0 ? Math.min(spentTotal / plannedTotal, 1) : 0;

  return {
    spentTotal,
    availableTotal: occasion.budgetAvailable,
    targetTotal: plannedTotal,
    plannedRemaining,
    availableAfterPlanned,
    spentProgress,
    status: spentTotal > plannedTotal
      ? 'over'
      : availableAfterPlanned < 0
        ? 'watch'
        : 'healthy',
  };
};

export const getTaskSummary = (tasks: FarhaPhase1Task[]): TaskSummary => {
  const actionableItems = tasks.filter((task) => task.status !== 'skipped');
  const doneCount = actionableItems.filter((task) => task.status === 'done').length;
  const nextPending = actionableItems
    .filter((task) => task.status === 'pending')
    .sort(compareTasks)[0];

  return {
    doneCount,
    actionableTotal: actionableItems.length,
    totalCount: tasks.length,
    skippedCount: tasks.length - actionableItems.length,
    nextPending,
    totals: calculateBudgetTotals(tasks),
  };
};

export const getChecklistSummary = (tasks: FarhaPhase1Task[]): ChecklistSummary => {
  const summary = getTaskSummary(tasks);
  return {
    doneCount: summary.doneCount,
    actionableTotal: summary.actionableTotal,
    totalCount: summary.totalCount,
    skippedCount: summary.skippedCount,
    nextPending: summary.nextPending,
  };
};

export const validateEventDraft = (
  draft: EventFormDraft,
): ValidationResult<'title' | 'date' | 'budgetSpent' | 'budgetAvailable' | 'budgetTarget'> => {
  const errors: ValidationResult<'title' | 'date' | 'budgetSpent' | 'budgetAvailable' | 'budgetTarget'>['errors'] = {};
  if (!draft.title.trim()) errors.title = 'required';
  if (!isValidDate(draft.date)) errors.date = 'required';
  if (!isValidCurrency(draft.budgetSpent)) errors.budgetSpent = 'invalidAmount';
  if (!isValidCurrency(draft.budgetAvailable)) errors.budgetAvailable = 'invalidAmount';
  if (!isValidCurrency(draft.budgetTarget)) errors.budgetTarget = 'invalidAmount';
  return { isValid: Object.keys(errors).length === 0, errors, warnings: {} };
};

export const validateTaskDraft = (
  draft: TaskDraft,
): ValidationResult<'title' | 'plannedCost' | 'actualCost' | 'depositPaid' | 'dueDate' | 'monthlyAmount' | 'nextDueDate'> => {
  const errors: ValidationResult<'title' | 'plannedCost' | 'actualCost' | 'depositPaid' | 'dueDate' | 'monthlyAmount' | 'nextDueDate'>['errors'] = {};
  const warnings: ValidationResult<'title' | 'plannedCost' | 'actualCost' | 'depositPaid' | 'dueDate' | 'monthlyAmount' | 'nextDueDate'>['warnings'] = {};

  if (!draft.title.trim()) errors.title = 'required';
  if (draft.dueDate && !isValidDate(draft.dueDate)) errors.dueDate = 'invalidDate';
  if (typeof draft.plannedCost === 'number' && !isValidCurrency(draft.plannedCost)) {
    errors.plannedCost = 'invalidAmount';
  }
  if (typeof draft.actualCost === 'number' && !isValidCurrency(draft.actualCost)) {
    errors.actualCost = 'invalidAmount';
  }
  if (typeof draft.depositPaid === 'number' && !isValidCurrency(draft.depositPaid)) {
    errors.depositPaid = 'invalidAmount';
  }
  if (draft.paymentPlan) {
    if (!isValidCurrency(draft.paymentPlan.monthlyAmount) || draft.paymentPlan.monthlyAmount <= 0) {
      errors.monthlyAmount = 'invalidAmount';
    }
    if (!isValidDate(draft.paymentPlan.nextDueDate)) errors.nextDueDate = 'invalidDate';
  }

  const base = typeof draft.actualCost === 'number' ? draft.actualCost : draft.plannedCost;
  if (typeof base === 'number' && typeof draft.depositPaid === 'number' && draft.depositPaid > base) {
    warnings.depositPaid = 'depositOverTotal';
  }

  return { isValid: Object.keys(errors).length === 0, errors, warnings };
};

export const validateBudgetCategoryDraft = (
  draft: BudgetCategoryDraft,
): ValidationResult<'name'> => {
  const errors: ValidationResult<'name'>['errors'] = {};
  if (!draft.name.trim()) errors.name = 'required';
  return { isValid: Object.keys(errors).length === 0, errors, warnings: {} };
};

export const validateBudgetItemDraft = (
  draft: BudgetItemDraft,
): ValidationResult<'name' | 'plannedCost' | 'actualCost' | 'depositPaid'> => {
  const taskValidation = validateTaskDraft({
    occasionId: '',
    title: draft.name,
    status: 'pending',
    plannedCost: draft.plannedCost,
    actualCost: draft.actualCost,
    depositPaid: draft.depositPaid,
  });
  return {
    isValid: taskValidation.isValid,
    errors: {
      name: taskValidation.errors.title,
      plannedCost: taskValidation.errors.plannedCost,
      actualCost: taskValidation.errors.actualCost,
      depositPaid: taskValidation.errors.depositPaid,
    },
    warnings: { depositPaid: taskValidation.warnings.depositPaid },
  };
};

export const validateChecklistItemDraft = (
  draft: ChecklistItemDraft,
): ValidationResult<'title' | 'dueDate'> => {
  const errors: ValidationResult<'title' | 'dueDate'>['errors'] = {};
  if (!draft.title.trim()) errors.title = 'required';
  if (draft.dueDate && !isValidDate(draft.dueDate)) errors.dueDate = 'invalidDate';
  return { isValid: Object.keys(errors).length === 0, errors, warnings: {} };
};

export const validateSavingsContributionDraft = (
  draft: SavingsContributionDraft,
): ValidationResult<'amount' | 'date'> => {
  const errors: ValidationResult<'amount' | 'date'>['errors'] = {};
  if (!isValidCurrency(draft.amount) || draft.amount <= 0) errors.amount = 'invalidAmount';
  if (!isValidDate(draft.date)) errors.date = 'invalidDate';
  return { isValid: Object.keys(errors).length === 0, errors, warnings: {} };
};

export const parseCurrencyInput = (value: string): number | undefined => {
  const normalized = value.replace(/,/g, '').trim();
  if (!normalized) return undefined;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? Math.max(parsed, 0) : Number.NaN;
};

export const formatCurrency = (amount: number): string =>
  Math.round(amount).toLocaleString('en-US');

export const getCountdownDays = (eventDate: string, now = new Date()): number =>
  differenceInCalendarDays(eventDate, now.toISOString().slice(0, 10));

export const isOverdue = (dueDate?: string, now = new Date()): boolean =>
  !!dueDate && differenceInCalendarDays(dueDate, now.toISOString().slice(0, 10)) < 0;

export const createSharePayload = (
  state: FarhaPhase1State,
  occasionId: string,
): string => {
  const occasion = getOccasionById(state, occasionId);
  if (!occasion) return 'Farha';

  const tasks = getEventTasks(state, occasion.id);
  const totals = calculateBudgetTotals(tasks);
  const summary = getTaskSummary(tasks);

  return [
    `${occasion.title} - ${occasion.date}`,
    `Tasks: ${summary.doneCount}/${summary.actionableTotal}`,
    `Planned: ${formatCurrency(totals.plannedTotal)}`,
    `Actual: ${formatCurrency(totals.actualTotal)}`,
    `Remaining: ${formatCurrency(totals.balanceTotal)}`,
    'Made with Farha',
  ].join('\n');
};

export const addBudgetCategory = (state: FarhaPhase1State): FarhaPhase1State => state;
export const deleteBudgetCategoryCascade = (state: FarhaPhase1State): FarhaPhase1State => state;
export const upsertPhase1BudgetItem = (
  state: FarhaPhase1State,
  draft: BudgetItemDraft,
  now = new Date(),
): FarhaPhase1State => {
  const category = getCategoryById(state, draft.categoryId);
  return upsertTask(state, {
    id: draft.id,
    occasionId: category?.eventId ?? state.activeOccasionId ?? '',
    category: category?.key,
    customCategory: category?.customName,
    title: draft.name,
    status: 'pending',
    plannedCost: draft.plannedCost,
    actualCost: draft.actualCost,
    depositPaid: draft.depositPaid,
    dueDate: draft.dueDate,
    notes: draft.notes,
  }, now);
};
export const deletePhase1BudgetItem = deleteTask;
export const upsertChecklistItem = (
  state: FarhaPhase1State,
  draft: ChecklistItemDraft,
  now = new Date(),
): FarhaPhase1State => upsertTask(state, {
  id: draft.id,
  occasionId: draft.eventId,
  title: draft.title,
  category: getCategoryById(state, draft.categoryId)?.key,
  dueDate: draft.dueDate,
  notes: draft.notes,
  status: draft.id ? getTaskById(state, draft.id)?.status ?? 'pending' : 'pending',
}, now);
export const setChecklistStatus = setTaskStatus;
export const deleteChecklistItem = deleteTask;
export const upsertSavingsContribution = (state: FarhaPhase1State): FarhaPhase1State => state;
export const deleteSavingsContribution = (state: FarhaPhase1State): FarhaPhase1State => state;
export const setSavingsMonthlyGoal = (state: FarhaPhase1State): FarhaPhase1State => state;
export const confirmSavingsAllocations = (state: FarhaPhase1State): FarhaPhase1State => state;
export const calculateFundBalance = (): number => 0;
export const getContributedThisMonth = (): number => 0;
export const getSavingsSummary = (): SavingsSummary => ({
  balance: 0,
  contributedThisMonth: 0,
  monthlyProgress: 0,
});
export const getAllocatableBudgetItems = (): FarhaPhase1BudgetItem[] => [];
export const suggestSavingsAllocations = (): SavingsAllocationInput[] => [];
export const getEventSavingsContributions = () => [];
export const getEventSavingsAllocations = () => [];
export const getSavingsContributionById = (
  _state?: FarhaPhase1State,
  _contributionId?: string,
): undefined => undefined;

export const getEventCategories = (
  state: FarhaPhase1State,
  eventId?: string,
): FarhaPhase1BudgetCategory[] => {
  const occasionId = eventId ?? state.activeOccasionId ?? '';
  const occasion = getOccasionById(state, occasionId);
  const selectedKeys = new Set(normalizeCategoryKeys(occasion?.categoryKeys));

  return defaultPhase1BudgetCategories
    .filter((category) => selectedKeys.has(category.key))
    .map((category) => ({
      id: `${occasionId || 'occasion'}-${category.key}`,
      eventId: occasionId,
      key: category.key,
      nameKey: category.nameKey,
      isDefault: true,
      createdAt: state.updatedAt,
      updatedAt: state.updatedAt,
    }));
};

export const getCategoryById = (
  state: FarhaPhase1State,
  categoryId?: string,
): FarhaPhase1BudgetCategory | undefined =>
  getEventCategories(state, state.activeOccasionId).find((category) => category.id === categoryId);

export const getCategoryItems = (
  state: FarhaPhase1State,
  categoryId?: string,
): FarhaPhase1Task[] => {
  const category = getCategoryById(state, categoryId);
  if (!category) return [];
  return getEventTasks(state, category.eventId).filter((task) => task.category === category.key);
};

export const getEventBudgetItems = getEventTasks;
export const getBudgetItemById = getTaskById;
export const getEventChecklistItems = getEventTasks;
export const getChecklistItemById = getTaskById;

const seedTasks = (occasion: FarhaPhase1Occasion, now: Date): FarhaPhase1Task[] => {
  const timestamp = now.toISOString();
  const templates = standardChecklistTemplates[occasion.type] ?? [];

  return templates.map((template, index) => ({
    id: createId(`${occasion.id}-task-${index}`, now),
    occasionId: occasion.id,
    title: template.titleKey,
    titleKey: template.titleKey,
    category: inferCategoryFromTitleKey(template.titleKey),
    dueDate: subtractDays(occasion.date, template.offsetDaysBeforeEvent),
    offsetDaysBeforeOccasion: template.offsetDaysBeforeEvent,
    status: 'pending',
    source: 'template',
    depositPaid: 0,
    createdAt: timestamp,
    updatedAt: timestamp,
  }));
};

const getNextWalkthroughStep = (
  step: FarhaPhase1WalkthroughStep,
): FarhaPhase1WalkthroughStep => {
  const index = phase1WalkthroughSteps.indexOf(step);
  return phase1WalkthroughSteps[index + 1] ?? 'completed';
};

const getPostCreateWalkthroughStep = (
  step: FarhaPhase1WalkthroughStep,
): FarhaPhase1WalkthroughStep =>
  step === 'createEvent' || step === 'eventCategories' || step === 'eventBudget'
    ? 'dashboardOverview'
    : step;

const refreshTaskNotifications = (
  state: FarhaPhase1State,
  occasionId: string,
  now: Date,
): FarhaPhase1ScheduledNotification[] => {
  const retained = state.scheduledNotifications.filter(
    (notification) => notification.occasionId !== occasionId,
  );
  if (!state.notificationsEnabled) return retained;

  const futureNotifications = getEventTasks(state, occasionId).flatMap((task) =>
    createNotificationForTask(task, now),
  );
  return [...retained, ...futureNotifications];
};

const createNotificationForTask = (
  task: FarhaPhase1Task,
  now: Date,
): FarhaPhase1ScheduledNotification[] => {
  const today = now.toISOString().slice(0, 10);
  const reminders: FarhaPhase1ScheduledNotification[] = [];

  if (task.status === 'pending' && task.dueDate && differenceInCalendarDays(task.dueDate, today) >= 0) {
    reminders.push({
      id: createId(`notification-${task.id}`, now),
      occasionId: task.occasionId,
      taskId: task.id,
      fireAt: `${task.dueDate}T09:00:00`,
      title: task.titleKey ?? task.title,
    });
  }

  if (
    task.paymentPlan &&
    calculateTaskBalance(task) > 0 &&
    differenceInCalendarDays(task.paymentPlan.nextDueDate, today) >= 0
  ) {
    reminders.push({
      id: createId(`notification-payment-${task.id}`, now),
      occasionId: task.occasionId,
      taskId: task.id,
      fireAt: `${task.paymentPlan.nextDueDate}T18:00:00`,
      title: 'farha.phase1.tasks.paymentReminder',
    });
  }

  return reminders;
};

const normalizeTaskDraft = (
  draft: TaskDraft,
): Omit<FarhaPhase1Task, 'id' | 'source' | 'createdAt' | 'updatedAt'> => ({
  occasionId: draft.occasionId,
  title: draft.title.trim(),
  category: draft.category,
  customCategory: normalizeOptionalText(draft.customCategory),
  dueDate: normalizeOptionalText(draft.dueDate),
  notes: normalizeOptionalText(draft.notes),
  status: draft.status,
  plannedCost: draft.plannedCost,
  actualCost: draft.actualCost,
  depositPaid: draft.depositPaid ?? 0,
  paymentPlan: draft.paymentPlan,
});

const migrateLegacyTasks = (
  state: LegacyPhase1State,
  occasions: FarhaPhase1Occasion[],
  now: Date,
): FarhaPhase1Task[] => {
  const timestamp = state.updatedAt ?? now.toISOString();
  const categoriesById = new Map((state.budgetCategories ?? []).map((category) => [category.id, category]));
  const occasionIds = new Set(occasions.map((occasion) => occasion.id));
  const checklistTasks = (state.checklistItems ?? []).flatMap((item) => {
    if (!item.eventId) return [];
    if (!occasionIds.has(item.eventId)) return [];
    const category = item.categoryId ? categoriesById.get(item.categoryId) : undefined;
    const linkedBudget = (state.budgetItems ?? []).find((budgetItem) =>
      item.categoryId && budgetItem.categoryId === item.categoryId &&
      normalizeSearchTitle(budgetItem.name ?? budgetItem.title) === normalizeSearchTitle(item.title),
    );

    return [{
      id: item.id,
      occasionId: item.eventId,
      title: item.title,
      titleKey: item.titleKey,
      category: category?.key,
      customCategory: category?.customName,
      dueDate: item.dueDate,
      offsetDaysBeforeOccasion: item.offsetDaysBeforeEvent,
      status: item.status,
      source: item.source,
      plannedCost: linkedBudget?.plannedCost,
      actualCost: linkedBudget?.actualCost,
      depositPaid: linkedBudget?.depositPaid ?? 0,
      notes: item.notes ?? linkedBudget?.notes,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }];
  });
  const taskIds = new Set(checklistTasks.map((task) => task.id));
  const budgetTasks = (state.budgetItems ?? []).flatMap((item) => {
    if (!item.categoryId) return [];
    const category = categoriesById.get(item.categoryId);
    if (!category || !occasionIds.has(category.eventId)) return [];
    const alreadyMerged = checklistTasks.some((task) =>
      task.category === category.key && normalizeSearchTitle(task.title) === normalizeSearchTitle(item.name ?? item.title),
    );
    if (alreadyMerged) return [];

    return [{
      id: taskIds.has(item.id) ? createId(`task-${item.id}`, now) : item.id,
      occasionId: category.eventId,
      title: item.name ?? item.title,
      category: category.key,
      customCategory: category.customName,
      dueDate: item.dueDate,
      status: 'pending' as const,
      source: 'custom' as const,
      plannedCost: item.plannedCost,
      actualCost: item.actualCost,
      depositPaid: item.depositPaid,
      notes: item.notes,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }];
  });

  return normalizeTasks([...checklistTasks, ...budgetTasks], occasions).map((task) => ({
    ...task,
    updatedAt: task.updatedAt ?? timestamp,
  }));
};

const normalizeOccasions = (occasions: FarhaPhase1Occasion[]): FarhaPhase1Occasion[] =>
  occasions.map((occasion) => ({
    ...occasion,
    type: phase1EventTypes.includes(occasion.type) ? occasion.type : 'other',
    categoryKeys: normalizeCategoryKeys(occasion.categoryKeys),
    budgetSpent: Number.isFinite(occasion.budgetSpent) ? occasion.budgetSpent : 0,
    budgetAvailable: Number.isFinite(occasion.budgetAvailable) ? occasion.budgetAvailable : 0,
    budgetTarget: Number.isFinite(occasion.budgetTarget) ? occasion.budgetTarget : 0,
  }));

const normalizeTasks = (
  tasks: FarhaPhase1Task[],
  occasions: FarhaPhase1Occasion[],
): FarhaPhase1Task[] => {
  const occasionIds = new Set(occasions.map((occasion) => occasion.id));
  return tasks
    .filter((task) => occasionIds.has(task.occasionId))
    .map((task) => ({
      ...task,
      depositPaid: task.depositPaid ?? 0,
      status: task.status ?? 'pending',
      source: task.source ?? 'custom',
    }));
};

const normalizeNotifications = (
  notifications: LegacyPhase1State['scheduledNotifications'],
  tasks: FarhaPhase1Task[],
): FarhaPhase1ScheduledNotification[] => {
  const taskById = new Map(tasks.map((task) => [task.id, task]));
  return (notifications ?? []).flatMap((notification) => {
    const taskId = 'taskId' in notification ? notification.taskId : notification.checklistItemId;
    const task = taskById.get(taskId);
    if (!task) return [];
    return [{
      id: notification.id,
      occasionId: task.occasionId,
      taskId,
      fireAt: notification.fireAt,
      title: notification.title,
    }];
  });
};

const normalizeActiveOccasionId = (
  requestedId: string | undefined,
  occasions: FarhaPhase1Occasion[],
): string | undefined =>
  requestedId && occasions.some((occasion) => occasion.id === requestedId)
    ? requestedId
    : occasions[0]?.id;

const hasTaskCost = (
  task: Pick<FarhaPhase1Task, 'plannedCost' | 'actualCost' | 'depositPaid'>,
): boolean =>
  typeof task.plannedCost === 'number' ||
  typeof task.actualCost === 'number' ||
  task.depositPaid > 0;

const normalizeCategoryKeys = (
  categoryKeys?: FarhaPhase1TaskCategoryKey[],
): FarhaPhase1TaskCategoryKey[] => {
  const keys = categoryKeys?.filter((key) => phase1TaskCategories.includes(key)) ?? phase1TaskCategories;
  return keys.length ? Array.from(new Set(keys)) : phase1TaskCategories;
};

const normalizeWalkthroughStep = (
  step?: FarhaPhase1WalkthroughStep,
): FarhaPhase1WalkthroughStep =>
  step && phase1WalkthroughSteps.includes(step) ? step : 'createEvent';

const inferCategoryFromTitleKey = (titleKey: string): FarhaPhase1TaskCategoryKey | undefined => {
  if (titleKey.includes('Venue')) return 'venue';
  if (titleKey.includes('Hotel')) return 'hotel';
  if (titleKey.includes('Dress')) return 'dress';
  if (titleKey.includes('Suit')) return 'groomSuit';
  if (titleKey.includes('Makeup')) return 'makeup';
  if (titleKey.includes('Barber')) return 'grooming';
  if (titleKey.includes('Gold') || titleKey.includes('Rings')) return 'gold';
  if (titleKey.includes('Catering')) return 'catering';
  if (titleKey.includes('Photo')) return 'photoVideo';
  if (titleKey.includes('Entertainment')) return 'entertainment';
  if (titleKey.includes('Gift')) return 'gifts';
  return undefined;
};

const shouldRecordInterstitial = (state: FarhaPhase1State, now: Date): boolean => {
  if (state.isPro) return false;
  if (!state.lastInterstitialShownAt) return true;
  const minutesSinceLast = (now.getTime() - new Date(state.lastInterstitialShownAt).getTime()) / 60000;
  return minutesSinceLast >= 4;
};

const compareTasks = (first: FarhaPhase1Task, second: FarhaPhase1Task): number => {
  const firstDate = first.dueDate ?? '9999-12-31';
  const secondDate = second.dueDate ?? '9999-12-31';
  return firstDate.localeCompare(secondDate) || first.title.localeCompare(second.title);
};

const subtractDays = (dateString: string, days: number): string => {
  const date = new Date(`${dateString}T12:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
};

const addMonths = (dateString: string, months: number): string => {
  const date = new Date(`${dateString}T12:00:00.000Z`);
  date.setUTCMonth(date.getUTCMonth() + months);
  return date.toISOString().slice(0, 10);
};

const differenceInCalendarDays = (targetDate: string, baseDate: string): number => {
  const target = Date.UTC(...parseDateParts(targetDate));
  const base = Date.UTC(...parseDateParts(baseDate));
  return Math.round((target - base) / 86400000);
};

const parseDateParts = (date: string): [number, number, number] => {
  const [year = '1970', month = '01', day = '01'] = date.split('-');
  return [Number(year), Number(month) - 1, Number(day)];
};

const isValidDate = (date: string): boolean =>
  /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(`${date}T12:00:00.000Z`));

const isValidCurrency = (value: number): boolean =>
  Number.isFinite(value) && value >= 0;

const normalizeOptionalText = (value?: string): string | undefined => {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
};

const normalizeSearchTitle = (value: string): string =>
  value.trim().toLocaleLowerCase();

const sumBy = <T>(items: T[], getValue: (item: T) => number): number =>
  items.reduce((total, item) => total + getValue(item), 0);

const createId = (prefix: string, now: Date): string =>
  `${prefix}-${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`;

const _budgetBadgeTypeCheck: BudgetBadgeStatus = 'on';
const _budgetPaymentTypeCheck: BudgetItemPaymentStatus = 'unpaid';
void _budgetBadgeTypeCheck;
void _budgetPaymentTypeCheck;
