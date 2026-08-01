import { defaultPhase1BudgetCategories } from '../data/defaultBudgetCategories';
import { standardChecklistTemplates } from '../data/checklistTemplates';
import type {
  BudgetCategoryDraft,
  BudgetItemDraft,
  BudgetItemPaymentStatus,
  BudgetTotals,
  ChecklistItemDraft,
  ChecklistSummary,
  ChecklistStatus,
  EventFormDraft,
  FarhaPhase1BudgetCategory,
  FarhaPhase1BudgetItem,
  FarhaPhase1ChecklistItem,
  FarhaPhase1Event,
  FarhaPhase1EventType,
  FarhaPhase1ScheduledNotification,
  FarhaPhase1State,
  Phase1Route,
  ValidationResult,
} from './phase1Types';

export const FARHA_PHASE1_SCHEMA_VERSION = 1;

export const phase1EventTypes: FarhaPhase1EventType[] = [
  'engagement',
  'wedding',
  'anniversary',
  'other',
];

export const createInitialPhase1State = (now = new Date()): FarhaPhase1State => ({
  schemaVersion: FARHA_PHASE1_SCHEMA_VERSION,
  hasOnboarded: false,
  isPro: false,
  notificationsEnabled: true,
  events: [],
  budgetCategories: [],
  budgetItems: [],
  checklistItems: [],
  scheduledNotifications: [],
  updatedAt: now.toISOString(),
});

export const resolveBootRoute = (state: FarhaPhase1State): Phase1Route => {
  if (!state.hasOnboarded) {
    return { name: 'OnboardingWelcomeScreen' };
  }

  if (!state.events.length) {
    return { name: 'EventCreateScreen' };
  }

  if (state.events.length === 1 || !state.isPro) {
    return {
      name: 'EventDashboardScreen',
      params: { eventId: state.activeEventId ?? state.events[0].id, tab: 'home' },
    };
  }

  return { name: 'EventListScreen' };
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
): FarhaPhase1State => {
  const timestamp = now.toISOString();
  const event: FarhaPhase1Event = {
    id: createId(`event-${draft.type}`, now),
    type: draft.type,
    title: draft.title.trim(),
    date: draft.date,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  const categories = seedBudgetCategories(event.id, now);
  const checklistItems = seedChecklistItems(event, state.notificationsEnabled, now);
  const scheduledNotifications = state.notificationsEnabled
    ? [
        ...state.scheduledNotifications,
        ...checklistItems.flatMap((item) => createNotificationForChecklistItem(event, item, now)),
      ]
    : state.scheduledNotifications;

  return {
    ...state,
    hasOnboarded: true,
    activeEventId: event.id,
    events: [...state.events, event],
    budgetCategories: [...state.budgetCategories, ...categories],
    checklistItems: [...state.checklistItems, ...checklistItems],
    scheduledNotifications,
    updatedAt: timestamp,
  };
};

export const updateEventWithTemplateDueDates = (
  state: FarhaPhase1State,
  draft: EventFormDraft,
  now = new Date(),
): FarhaPhase1State => {
  if (!draft.id) return state;

  const timestamp = now.toISOString();
  const event = state.events.find((candidate) => candidate.id === draft.id);
  if (!event) return state;

  const updatedEvent: FarhaPhase1Event = {
    ...event,
    type: draft.type,
    title: draft.title.trim(),
    date: draft.date,
    updatedAt: timestamp,
  };
  const checklistItems = state.checklistItems.map((item) => {
    if (
      item.eventId !== updatedEvent.id ||
      item.source !== 'template' ||
      item.status !== 'pending' ||
      typeof item.offsetDaysBeforeEvent !== 'number'
    ) {
      return item;
    }

    return {
      ...item,
      dueDate: subtractDays(updatedEvent.date, item.offsetDaysBeforeEvent),
      updatedAt: timestamp,
    };
  });

  const withoutEventNotifications = state.scheduledNotifications.filter(
    (notification) => notification.eventId !== updatedEvent.id,
  );
  const refreshedNotifications = state.notificationsEnabled
    ? checklistItems
        .filter((item) => item.eventId === updatedEvent.id)
        .flatMap((item) => createNotificationForChecklistItem(updatedEvent, item, now))
    : [];

  return {
    ...state,
    activeEventId: updatedEvent.id,
    events: state.events.map((candidate) =>
      candidate.id === updatedEvent.id ? updatedEvent : candidate,
    ),
    checklistItems,
    scheduledNotifications: [...withoutEventNotifications, ...refreshedNotifications],
    updatedAt: timestamp,
  };
};

export const deleteEventCascade = (
  state: FarhaPhase1State,
  eventId: string,
  now = new Date(),
): FarhaPhase1State => {
  const categoryIds = new Set(
    state.budgetCategories
      .filter((category) => category.eventId === eventId)
      .map((category) => category.id),
  );
  const remainingEvents = state.events.filter((event) => event.id !== eventId);
  const nextActiveEventId = state.activeEventId === eventId
    ? remainingEvents[0]?.id
    : state.activeEventId;

  return {
    ...state,
    activeEventId: nextActiveEventId,
    events: remainingEvents,
    budgetCategories: state.budgetCategories.filter((category) => category.eventId !== eventId),
    budgetItems: state.budgetItems.filter((item) => !categoryIds.has(item.categoryId)),
    checklistItems: state.checklistItems.filter((item) => item.eventId !== eventId),
    scheduledNotifications: state.scheduledNotifications.filter(
      (notification) => notification.eventId !== eventId,
    ),
    updatedAt: now.toISOString(),
  };
};

export const setActiveEvent = (
  state: FarhaPhase1State,
  eventId: string,
  now = new Date(),
): FarhaPhase1State => ({
  ...state,
  activeEventId: eventId,
  updatedAt: now.toISOString(),
});

export const addBudgetCategory = (
  state: FarhaPhase1State,
  draft: BudgetCategoryDraft,
  now = new Date(),
): FarhaPhase1State => {
  const timestamp = now.toISOString();
  const category: FarhaPhase1BudgetCategory = {
    id: createId('budget-category', now),
    eventId: draft.eventId,
    customName: draft.name.trim(),
    isDefault: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  return {
    ...state,
    budgetCategories: [...state.budgetCategories, category],
    updatedAt: timestamp,
  };
};

export const deleteBudgetCategoryCascade = (
  state: FarhaPhase1State,
  categoryId: string,
  now = new Date(),
): FarhaPhase1State => ({
  ...state,
  budgetCategories: state.budgetCategories.filter((category) => category.id !== categoryId),
  budgetItems: state.budgetItems.filter((item) => item.categoryId !== categoryId),
  updatedAt: now.toISOString(),
});

export const upsertPhase1BudgetItem = (
  state: FarhaPhase1State,
  draft: BudgetItemDraft,
  now = new Date(),
): FarhaPhase1State => {
  const timestamp = now.toISOString();
  const normalizedDraft = normalizeBudgetDraft(draft);

  if (draft.id) {
    return {
      ...state,
      budgetItems: state.budgetItems.map((item) =>
        item.id === draft.id
          ? {
              ...item,
              ...normalizedDraft,
              updatedAt: timestamp,
            }
          : item,
      ),
      lastInterstitialShownAt: shouldRecordInterstitial(state, now)
        ? timestamp
        : state.lastInterstitialShownAt,
      updatedAt: timestamp,
    };
  }

  const item: FarhaPhase1BudgetItem = {
    id: createId('budget-item', now),
    ...normalizedDraft,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  return {
    ...state,
    budgetItems: [...state.budgetItems, item],
    lastInterstitialShownAt: shouldRecordInterstitial(state, now)
      ? timestamp
      : state.lastInterstitialShownAt,
    updatedAt: timestamp,
  };
};

export const deletePhase1BudgetItem = (
  state: FarhaPhase1State,
  itemId: string,
  now = new Date(),
): FarhaPhase1State => ({
  ...state,
  budgetItems: state.budgetItems.filter((item) => item.id !== itemId),
  updatedAt: now.toISOString(),
});

export const upsertChecklistItem = (
  state: FarhaPhase1State,
  draft: ChecklistItemDraft,
  now = new Date(),
): FarhaPhase1State => {
  const timestamp = now.toISOString();
  const normalizedDraft = {
    eventId: draft.eventId,
    categoryId: normalizeOptionalText(draft.categoryId),
    title: draft.title.trim(),
    dueDate: normalizeOptionalText(draft.dueDate),
    notes: normalizeOptionalText(draft.notes),
  };

  const event = getEventById(state, draft.eventId);
  if (!event) return state;

  const withoutOldNotification = draft.id
    ? state.scheduledNotifications.filter((notification) => notification.checklistItemId !== draft.id)
    : state.scheduledNotifications;

  if (draft.id) {
    const checklistItems = state.checklistItems.map((item) =>
      item.id === draft.id
        ? {
            ...item,
            ...normalizedDraft,
            source: item.source,
            status: item.status,
            titleKey: undefined,
            updatedAt: timestamp,
          }
        : item,
    );
    const updatedItem = checklistItems.find((item) => item.id === draft.id);

    return {
      ...state,
      checklistItems,
      scheduledNotifications: updatedItem && state.notificationsEnabled
        ? [
            ...withoutOldNotification,
            ...createNotificationForChecklistItem(event, updatedItem, now),
          ]
        : withoutOldNotification,
      updatedAt: timestamp,
    };
  }

  const item: FarhaPhase1ChecklistItem = {
    id: createId('checklist-item', now),
    ...normalizedDraft,
    status: 'pending',
    source: 'custom',
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  return {
    ...state,
    checklistItems: [...state.checklistItems, item],
    scheduledNotifications: state.notificationsEnabled
      ? [
          ...state.scheduledNotifications,
          ...createNotificationForChecklistItem(event, item, now),
        ]
      : state.scheduledNotifications,
    updatedAt: timestamp,
  };
};

export const setChecklistStatus = (
  state: FarhaPhase1State,
  itemId: string,
  status: ChecklistStatus,
  now = new Date(),
): FarhaPhase1State => ({
  ...state,
  checklistItems: state.checklistItems.map((item) =>
    item.id === itemId
      ? { ...item, status, updatedAt: now.toISOString() }
      : item,
  ),
  scheduledNotifications: status === 'pending'
    ? state.scheduledNotifications
    : state.scheduledNotifications.filter(
        (notification) => notification.checklistItemId !== itemId,
      ),
  updatedAt: now.toISOString(),
});

export const deleteChecklistItem = (
  state: FarhaPhase1State,
  itemId: string,
  now = new Date(),
): FarhaPhase1State => ({
  ...state,
  checklistItems: state.checklistItems.filter((item) => item.id !== itemId),
  scheduledNotifications: state.scheduledNotifications.filter(
    (notification) => notification.checklistItemId !== itemId,
  ),
  updatedAt: now.toISOString(),
});

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
  if (!enabled) {
    return {
      ...state,
      notificationsEnabled: false,
      scheduledNotifications: [],
      updatedAt: now.toISOString(),
    };
  }

  return {
    ...state,
    notificationsEnabled: true,
    scheduledNotifications: state.checklistItems.flatMap((item) => {
      const event = getEventById(state, item.eventId);
      return event ? createNotificationForChecklistItem(event, item, now) : [];
    }),
    updatedAt: now.toISOString(),
  };
};

export const clearAllPhase1Data = (now = new Date()): FarhaPhase1State =>
  createInitialPhase1State(now);

export const getEventById = (
  state: FarhaPhase1State,
  eventId?: string,
): FarhaPhase1Event | undefined =>
  state.events.find((event) => event.id === eventId);

export const getActiveEvent = (state: FarhaPhase1State): FarhaPhase1Event | undefined =>
  getEventById(state, state.activeEventId) ?? state.events[0];

export const getEventCategories = (
  state: FarhaPhase1State,
  eventId?: string,
): FarhaPhase1BudgetCategory[] =>
  state.budgetCategories.filter((category) => category.eventId === eventId);

export const getCategoryById = (
  state: FarhaPhase1State,
  categoryId?: string,
): FarhaPhase1BudgetCategory | undefined =>
  state.budgetCategories.find((category) => category.id === categoryId);

export const getCategoryItems = (
  state: FarhaPhase1State,
  categoryId?: string,
): FarhaPhase1BudgetItem[] =>
  state.budgetItems.filter((item) => item.categoryId === categoryId);

export const getEventBudgetItems = (
  state: FarhaPhase1State,
  eventId?: string,
): FarhaPhase1BudgetItem[] => {
  const categoryIds = new Set(getEventCategories(state, eventId).map((category) => category.id));
  return state.budgetItems.filter((item) => categoryIds.has(item.categoryId));
};

export const getBudgetItemById = (
  state: FarhaPhase1State,
  itemId?: string,
): FarhaPhase1BudgetItem | undefined =>
  state.budgetItems.find((item) => item.id === itemId);

export const getEventChecklistItems = (
  state: FarhaPhase1State,
  eventId?: string,
): FarhaPhase1ChecklistItem[] =>
  state.checklistItems
    .filter((item) => item.eventId === eventId)
    .sort(compareChecklistItems);

export const getChecklistItemById = (
  state: FarhaPhase1State,
  itemId?: string,
): FarhaPhase1ChecklistItem | undefined =>
  state.checklistItems.find((item) => item.id === itemId);

export const calculateItemBalance = (item: Pick<FarhaPhase1BudgetItem, 'plannedCost' | 'actualCost' | 'depositPaid'>): number =>
  getBudgetActualBase(item) - item.depositPaid;

export const getBudgetActualBase = (
  item: Pick<FarhaPhase1BudgetItem, 'plannedCost' | 'actualCost'>,
): number => item.actualCost ?? item.plannedCost;

export const getBudgetItemStatus = (
  item: Pick<FarhaPhase1BudgetItem, 'plannedCost' | 'actualCost' | 'depositPaid'>,
): BudgetItemPaymentStatus => {
  if (item.depositPaid <= 0) return 'unpaid';
  if (calculateItemBalance(item) <= 0) return 'paid';
  return 'partial';
};

export const calculateBudgetTotals = (items: FarhaPhase1BudgetItem[]): BudgetTotals => {
  const plannedTotal = sumBy(items, (item) => item.plannedCost);
  const actualTotal = sumBy(items, getBudgetActualBase);
  const depositTotal = sumBy(items, (item) => item.depositPaid);
  const balanceTotal = sumBy(items, calculateItemBalance);

  return {
    plannedTotal,
    actualTotal,
    depositTotal,
    balanceTotal,
    badge: actualTotal > plannedTotal ? 'over' : 'on',
  };
};

export const getChecklistSummary = (
  items: FarhaPhase1ChecklistItem[],
): ChecklistSummary => {
  const actionableItems = items.filter((item) => item.status !== 'skipped');
  const doneCount = actionableItems.filter((item) => item.status === 'done').length;
  const nextPending = actionableItems
    .filter((item) => item.status === 'pending')
    .sort(compareChecklistItems)[0];

  return {
    doneCount,
    actionableTotal: actionableItems.length,
    totalCount: items.length,
    skippedCount: items.length - actionableItems.length,
    nextPending,
  };
};

export const validateEventDraft = (
  draft: EventFormDraft,
): ValidationResult<'title' | 'date'> => {
  const errors: ValidationResult<'title' | 'date'>['errors'] = {};

  if (!draft.title.trim()) errors.title = 'required';
  if (!isValidDate(draft.date)) errors.date = 'required';

  return { isValid: Object.keys(errors).length === 0, errors, warnings: {} };
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
  const errors: ValidationResult<'name' | 'plannedCost' | 'actualCost' | 'depositPaid'>['errors'] = {};
  const warnings: ValidationResult<'name' | 'plannedCost' | 'actualCost' | 'depositPaid'>['warnings'] = {};

  if (!draft.name.trim()) errors.name = 'required';
  if (!isValidCurrency(draft.plannedCost)) errors.plannedCost = 'invalidAmount';
  if (typeof draft.actualCost === 'number' && !isValidCurrency(draft.actualCost)) {
    errors.actualCost = 'invalidAmount';
  }
  if (!isValidCurrency(draft.depositPaid)) errors.depositPaid = 'invalidAmount';

  const base = typeof draft.actualCost === 'number' ? draft.actualCost : draft.plannedCost;
  if (Number.isFinite(base) && draft.depositPaid > base) {
    warnings.depositPaid = 'depositOverTotal';
  }

  return { isValid: Object.keys(errors).length === 0, errors, warnings };
};

export const validateChecklistItemDraft = (
  draft: ChecklistItemDraft,
): ValidationResult<'title' | 'dueDate'> => {
  const errors: ValidationResult<'title' | 'dueDate'>['errors'] = {};
  if (!draft.title.trim()) errors.title = 'required';
  if (draft.dueDate && !isValidDate(draft.dueDate)) errors.dueDate = 'invalidDate';
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
  eventId: string,
): string => {
  const event = getEventById(state, eventId);
  if (!event) return 'Farha';

  const budgetTotals = calculateBudgetTotals(getEventBudgetItems(state, event.id));
  const checklistSummary = getChecklistSummary(getEventChecklistItems(state, event.id));

  return [
    `${event.title} - ${event.date}`,
    `Budget planned: ${formatCurrency(budgetTotals.plannedTotal)}`,
    `Budget actual: ${formatCurrency(budgetTotals.actualTotal)}`,
    `Checklist: ${checklistSummary.doneCount}/${checklistSummary.actionableTotal}`,
    'Made with Farha',
  ].join('\n');
};

const seedBudgetCategories = (
  eventId: string,
  now: Date,
): FarhaPhase1BudgetCategory[] => {
  const timestamp = now.toISOString();

  return defaultPhase1BudgetCategories.map((category, index) => ({
    id: createId(`${eventId}-category-${category.key}-${index}`, now),
    eventId,
    key: category.key,
    nameKey: category.nameKey,
    isDefault: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  }));
};

const seedChecklistItems = (
  event: FarhaPhase1Event,
  _notificationsEnabled: boolean,
  now: Date,
): FarhaPhase1ChecklistItem[] => {
  const timestamp = now.toISOString();
  const templates = standardChecklistTemplates[event.type] ?? [];

  return templates.map((template, index) => ({
    id: createId(`${event.id}-checklist-${index}`, now),
    eventId: event.id,
    title: template.titleKey,
    titleKey: template.titleKey,
    dueDate: subtractDays(event.date, template.offsetDaysBeforeEvent),
    offsetDaysBeforeEvent: template.offsetDaysBeforeEvent,
    status: 'pending',
    source: 'template',
    createdAt: timestamp,
    updatedAt: timestamp,
  }));
};

const createNotificationForChecklistItem = (
  event: FarhaPhase1Event,
  item: FarhaPhase1ChecklistItem,
  now: Date,
): FarhaPhase1ScheduledNotification[] => {
  if (item.status !== 'pending' || !item.dueDate) return [];
  if (differenceInCalendarDays(item.dueDate, now.toISOString().slice(0, 10)) < 0) return [];

  return [{
    id: createId(`notification-${item.id}`, now),
    eventId: event.id,
    checklistItemId: item.id,
    fireAt: `${item.dueDate}T09:00:00`,
    title: item.titleKey ?? item.title,
  }];
};

const normalizeBudgetDraft = (draft: BudgetItemDraft): Omit<FarhaPhase1BudgetItem, 'id' | 'createdAt' | 'updatedAt'> => ({
  categoryId: draft.categoryId,
  name: draft.name.trim(),
  plannedCost: draft.plannedCost,
  actualCost: draft.actualCost,
  depositPaid: draft.depositPaid,
  dueDate: normalizeOptionalText(draft.dueDate),
  notes: normalizeOptionalText(draft.notes),
});

const shouldRecordInterstitial = (state: FarhaPhase1State, now: Date): boolean => {
  if (state.isPro) return false;
  if (!state.lastInterstitialShownAt) return true;

  const minutesSinceLast = (now.getTime() - new Date(state.lastInterstitialShownAt).getTime()) / 60000;
  return minutesSinceLast >= 4;
};

const compareChecklistItems = (
  first: FarhaPhase1ChecklistItem,
  second: FarhaPhase1ChecklistItem,
): number => {
  const firstDate = first.dueDate ?? '9999-12-31';
  const secondDate = second.dueDate ?? '9999-12-31';
  return firstDate.localeCompare(secondDate);
};

const subtractDays = (dateString: string, days: number): string => {
  const date = new Date(`${dateString}T12:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() - days);
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

const sumBy = <T>(items: T[], getValue: (item: T) => number): number =>
  items.reduce((total, item) => total + getValue(item), 0);

const createId = (prefix: string, now: Date): string =>
  `${prefix}-${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`;
