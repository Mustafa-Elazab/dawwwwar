import { defaultBudgetCategories } from '../../features/budget/data/defaultBudgetCategories';
import type {
  BudgetCategory,
  BudgetItem,
  BudgetItemDraft,
  FarhaBudgetState,
  FarhaEvent,
  FarhaEventType,
} from '../../types';
import {
  FARHA_BUDGET_SCHEMA_VERSION,
  FARHA_BUDGET_STORAGE_KEY,
} from './farhaDatabaseSchema';

export interface FarhaKeyValueStore {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
}

export interface FarhaBudgetRepository {
  load: () => FarhaBudgetState;
  save: (state: FarhaBudgetState) => void;
}

export const createFarhaBudgetRepository = (
  storage: FarhaKeyValueStore,
): FarhaBudgetRepository => ({
  load: () => loadFarhaBudgetState(storage),
  save: (state) => storage.set(FARHA_BUDGET_STORAGE_KEY, JSON.stringify(state)),
});

export const loadFarhaBudgetState = (storage: FarhaKeyValueStore): FarhaBudgetState => {
  const raw = storage.getString(FARHA_BUDGET_STORAGE_KEY);

  if (!raw) {
    const seeded = createInitialBudgetState();
    storage.set(FARHA_BUDGET_STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }

  return normalizeBudgetState(JSON.parse(raw) as Partial<FarhaBudgetState>);
};

export const createInitialBudgetState = (now = new Date()): FarhaBudgetState => {
  const event = createEvent('wedding', now);
  const categories = createDefaultBudgetCategories(event.id, now);

  return {
    schemaVersion: FARHA_BUDGET_SCHEMA_VERSION,
    activeEventId: event.id,
    events: [event],
    categories,
    items: [],
    updatedAt: now.toISOString(),
  };
};

export const ensureEventForType = (
  state: FarhaBudgetState,
  type: FarhaEventType,
  now = new Date(),
): FarhaBudgetState => {
  const existingEvent = state.events.find((event) => event.type === type);

  if (existingEvent) {
    return {
      ...state,
      activeEventId: existingEvent.id,
      updatedAt: now.toISOString(),
    };
  }

  const event = createEvent(type, now);
  const categories = createDefaultBudgetCategories(event.id, now);

  return {
    ...state,
    activeEventId: event.id,
    events: [...state.events, event],
    categories: [...state.categories, ...categories],
    updatedAt: now.toISOString(),
  };
};

export const upsertBudgetItem = (
  state: FarhaBudgetState,
  draft: BudgetItemDraft,
  now = new Date(),
): FarhaBudgetState => {
  const timestamp = now.toISOString();
  const normalizedDraft: BudgetItemDraft = {
    ...draft,
    title: draft.title.trim(),
    dueDate: normalizeOptionalText(draft.dueDate),
    notes: normalizeOptionalText(draft.notes),
  };

  if (normalizedDraft.id) {
    return {
      ...state,
      items: state.items.map((item) =>
        item.id === normalizedDraft.id
          ? {
              ...item,
              ...normalizedDraft,
              updatedAt: timestamp,
            }
          : item,
      ),
      updatedAt: timestamp,
    };
  }

  const item: BudgetItem = {
    id: createId('budget-item', now),
    categoryId: normalizedDraft.categoryId,
    title: normalizedDraft.title,
    plannedCost: normalizedDraft.plannedCost,
    actualCost: normalizedDraft.actualCost,
    depositPaid: normalizedDraft.depositPaid,
    dueDate: normalizedDraft.dueDate,
    notes: normalizedDraft.notes,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  return {
    ...state,
    items: [...state.items, item],
    updatedAt: timestamp,
  };
};

export const getActiveEvent = (state: FarhaBudgetState): FarhaEvent =>
  state.events.find((event) => event.id === state.activeEventId) ?? state.events[0];

export const getCategoriesForEvent = (
  state: FarhaBudgetState,
  eventId: string,
): BudgetCategory[] =>
  state.categories.filter((category) => category.eventId === eventId);

export const getItemsForEvent = (
  state: FarhaBudgetState,
  eventId: string,
): BudgetItem[] => {
  const categoryIds = new Set(getCategoriesForEvent(state, eventId).map((category) => category.id));
  return state.items.filter((item) => categoryIds.has(item.categoryId));
};

const normalizeBudgetState = (state: Partial<FarhaBudgetState>): FarhaBudgetState => {
  if (!state.events?.length) {
    return createInitialBudgetState();
  }

  const now = new Date().toISOString();
  const activeEventId = state.activeEventId && state.events.some((event) => event.id === state.activeEventId)
    ? state.activeEventId
    : state.events[0].id;

  return {
    schemaVersion: FARHA_BUDGET_SCHEMA_VERSION,
    activeEventId,
    events: state.events,
    categories: state.categories ?? [],
    items: state.items ?? [],
    updatedAt: state.updatedAt ?? now,
  };
};

const createEvent = (type: FarhaEventType, now: Date): FarhaEvent => {
  const timestamp = now.toISOString();

  return {
    id: createId(`event-${type}`, now),
    type,
    title: `farha.m1.events.${type}`,
    date: getDefaultEventDate(now),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

const createDefaultBudgetCategories = (eventId: string, now: Date): BudgetCategory[] => {
  const timestamp = now.toISOString();

  return defaultBudgetCategories.map((category, index) => ({
    id: createId(`${eventId}-${category.key}-${index}`, now),
    eventId,
    key: category.key,
    nameKey: category.nameKey,
    isDefault: true,
    createdAt: timestamp,
  }));
};

const getDefaultEventDate = (now: Date): string => {
  const date = new Date(now);
  date.setMonth(date.getMonth() + 6);
  return date.toISOString().slice(0, 10);
};

const normalizeOptionalText = (value?: string): string | undefined => {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
};

const createId = (prefix: string, now: Date): string =>
  `${prefix}-${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`;
