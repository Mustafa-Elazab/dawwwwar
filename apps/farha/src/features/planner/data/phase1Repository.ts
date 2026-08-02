import { farhaStorage } from '../../../app/storage';
import {
  createInitialPhase1State,
  FARHA_PHASE1_SCHEMA_VERSION,
} from '../domain/phase1Logic';
import type { FarhaPhase1State } from '../domain/phase1Types';

export const FARHA_PHASE1_STORAGE_KEY = 'farha.phase1.v1';

export interface Phase1KeyValueStore {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  delete?: (key: string) => void;
}

export interface Phase1Repository {
  load: () => FarhaPhase1State;
  save: (state: FarhaPhase1State) => void;
  clear: () => void;
}

export const createPhase1Repository = (
  storage: Phase1KeyValueStore = farhaStorage,
): Phase1Repository => ({
  load: () => loadPhase1State(storage),
  save: (state) => storage.set(FARHA_PHASE1_STORAGE_KEY, JSON.stringify(state)),
  clear: () => storage.delete?.(FARHA_PHASE1_STORAGE_KEY),
});

export const loadPhase1State = (storage: Phase1KeyValueStore): FarhaPhase1State => {
  const raw = storage.getString(FARHA_PHASE1_STORAGE_KEY);
  if (!raw) {
    return createInitialPhase1State();
  }

  try {
    return normalizePhase1State(JSON.parse(raw) as Partial<FarhaPhase1State>);
  } catch {
    return createInitialPhase1State();
  }
};

const normalizePhase1State = (state: Partial<FarhaPhase1State>): FarhaPhase1State => {
  const fallback = createInitialPhase1State();
  const events = state.events ?? [];
  const activeEventId = state.activeEventId && events.some((event) => event.id === state.activeEventId)
    ? state.activeEventId
    : events[0]?.id;

  return {
    schemaVersion: FARHA_PHASE1_SCHEMA_VERSION,
    hasOnboarded: state.hasOnboarded ?? fallback.hasOnboarded,
    isPro: state.isPro ?? fallback.isPro,
    notificationsEnabled: state.notificationsEnabled ?? fallback.notificationsEnabled,
    activeEventId,
    events,
    budgetCategories: state.budgetCategories ?? [],
    budgetItems: state.budgetItems ?? [],
    checklistItems: state.checklistItems ?? [],
    scheduledNotifications: state.scheduledNotifications ?? [],
    lastInterstitialShownAt: state.lastInterstitialShownAt,
    updatedAt: state.updatedAt ?? fallback.updatedAt,
  };
};
