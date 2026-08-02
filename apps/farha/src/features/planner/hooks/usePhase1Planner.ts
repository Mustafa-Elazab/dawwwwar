import { useCallback, useEffect, useMemo, useState } from 'react';
import { Share } from 'react-native';

import {
  addBudgetCategory,
  clearAllPhase1Data,
  completeOnboarding,
  createEventWithSeeds,
  createSharePayload,
  deleteBudgetCategoryCascade,
  deleteChecklistItem,
  deleteEventCascade,
  deletePhase1BudgetItem,
  getActiveEvent,
  getBudgetItemById,
  getCategoryById,
  getCategoryItems,
  getChecklistItemById,
  getChecklistSummary,
  getEventBudgetItems,
  getEventById,
  getEventCategories,
  getEventChecklistItems,
  resolveBootRoute,
  setActiveEvent,
  setChecklistStatus,
  setNotificationsEnabled,
  setProStatus,
  updateEventWithTemplateDueDates,
  upsertChecklistItem,
  upsertPhase1BudgetItem,
} from '../domain/phase1Logic';
import type {
  BudgetCategoryDraft,
  BudgetItemDraft,
  ChecklistItemDraft,
  ChecklistStatus,
  EventFormDraft,
  FarhaPhase1BudgetCategory,
  FarhaPhase1BudgetItem,
  FarhaPhase1ChecklistItem,
  FarhaPhase1Event,
  FarhaPhase1State,
  Phase1Route,
  Phase1ScreenName,
  Phase1TabKey,
} from '../domain/phase1Types';
import { createPhase1BillingClient } from '../../monetization/data/phase1Billing';
import { createPhase1Repository } from '../data/phase1Repository';

export type Phase1Status = 'loading' | 'ready' | 'error';

export interface Phase1PlannerController {
  status: Phase1Status;
  state: FarhaPhase1State;
  route: Phase1Route;
  activeTab: Phase1TabKey;
  activeEvent?: FarhaPhase1Event;
  activeCategories: FarhaPhase1BudgetCategory[];
  activeBudgetItems: FarhaPhase1BudgetItem[];
  activeChecklistItems: FarhaPhase1ChecklistItem[];
  errorMessageKey?: string;
  reload: () => void;
  navigate: (name: Phase1ScreenName, params?: Phase1Route['params']) => void;
  replace: (name: Phase1ScreenName, params?: Phase1Route['params']) => void;
  goBack: () => void;
  openTab: (tab: Phase1TabKey) => void;
  completeOnboarding: () => void;
  createEvent: (draft: EventFormDraft) => boolean;
  updateEvent: (draft: EventFormDraft) => void;
  deleteEvent: (eventId: string) => void;
  openEvent: (eventId: string) => void;
  addBudgetCategory: (draft: BudgetCategoryDraft) => void;
  deleteBudgetCategory: (categoryId: string) => void;
  saveBudgetItem: (draft: BudgetItemDraft) => void;
  deleteBudgetItem: (itemId: string) => void;
  saveChecklistItem: (draft: ChecklistItemDraft) => void;
  setChecklistItemStatus: (itemId: string, status: ChecklistStatus) => void;
  deleteChecklistItem: (itemId: string) => void;
  upgradeToPro: () => void;
  restorePurchase: () => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  clearAllData: () => void;
  shareActiveEvent: () => Promise<void>;
  getEventById: (eventId?: string) => FarhaPhase1Event | undefined;
  getCategoryById: (categoryId?: string) => FarhaPhase1BudgetCategory | undefined;
  getBudgetItemById: (itemId?: string) => FarhaPhase1BudgetItem | undefined;
  getChecklistItemById: (itemId?: string) => FarhaPhase1ChecklistItem | undefined;
  getEventCategories: (eventId?: string) => FarhaPhase1BudgetCategory[];
  getCategoryItems: (categoryId?: string) => FarhaPhase1BudgetItem[];
  getEventBudgetItems: (eventId?: string) => FarhaPhase1BudgetItem[];
  getEventChecklistItems: (eventId?: string) => FarhaPhase1ChecklistItem[];
  getChecklistSummary: (items: FarhaPhase1ChecklistItem[]) => ReturnType<typeof getChecklistSummary>;
}

const repository = createPhase1Repository();
const billingClient = createPhase1BillingClient();

export const usePhase1Planner = (): Phase1PlannerController => {
  const [status, setStatus] = useState<Phase1Status>('loading');
  const [state, setState] = useState<FarhaPhase1State>(() => repository.load());
  const [routes, setRoutes] = useState<Phase1Route[]>([{ name: 'SplashScreen' }]);
  const [activeTab, setActiveTab] = useState<Phase1TabKey>('home');
  const [errorMessageKey, setErrorMessageKey] = useState<string | undefined>();

  const route = routes[routes.length - 1] ?? { name: 'SplashScreen' };
  const activeEvent = useMemo(() => getActiveEvent(state), [state]);
  const activeCategories = useMemo(
    () => getEventCategories(state, activeEvent?.id),
    [activeEvent?.id, state],
  );
  const activeBudgetItems = useMemo(
    () => getEventBudgetItems(state, activeEvent?.id),
    [activeEvent?.id, state],
  );
  const activeChecklistItems = useMemo(
    () => getEventChecklistItems(state, activeEvent?.id),
    [activeEvent?.id, state],
  );

  const persist = useCallback((nextState: FarhaPhase1State) => {
    try {
      repository.save(nextState);
      setState(nextState);
      setStatus('ready');
      setErrorMessageKey(undefined);
    } catch {
      setStatus('error');
      setErrorMessageKey('farha.phase1.errors.save');
    }
  }, []);

  const reload = useCallback(() => {
    try {
      setStatus('loading');
      const loaded = repository.load();
      setState(loaded);
      setRoutes([{ name: 'SplashScreen' }]);
      setStatus('ready');
      setErrorMessageKey(undefined);
    } catch {
      setStatus('error');
      setErrorMessageKey('farha.phase1.errors.load');
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    if (status !== 'ready' || route.name !== 'SplashScreen') return;

    const bootRoute = resolveBootRoute(state);
    setRoutes([bootRoute]);
    if (bootRoute.params?.tab) {
      setActiveTab(bootRoute.params.tab);
    }
  }, [route.name, state, status]);

  const navigate = useCallback((name: Phase1ScreenName, params?: Phase1Route['params']) => {
    setRoutes((current) => [...current, { name, params }]);
  }, []);

  const replace = useCallback((name: Phase1ScreenName, params?: Phase1Route['params']) => {
    setRoutes((current) => [...current.slice(0, -1), { name, params }]);
  }, []);

  const reset = useCallback((name: Phase1ScreenName, params?: Phase1Route['params']) => {
    setRoutes([{ name, params }]);
  }, []);

  const goBack = useCallback(() => {
    setRoutes((current) => {
      if (current.length > 1) return current.slice(0, -1);
      return [resolveBootRoute(state)];
    });
  }, [state]);

  const openTab = useCallback((tab: Phase1TabKey) => {
    const screenByTab: Record<Phase1TabKey, Phase1ScreenName> = {
      home: 'EventDashboardScreen',
      budget: 'BudgetCategoryListScreen',
      checklist: 'ChecklistTimelineScreen',
      settings: 'SettingsScreen',
    };
    setActiveTab(tab);
    reset(screenByTab[tab], { eventId: state.activeEventId, tab });
  }, [reset, state.activeEventId]);

  const completeOnboardingAction = useCallback(() => {
    persist(completeOnboarding(state));
    reset('EventCreateScreen');
  }, [persist, reset, state]);

  const createEventAction = useCallback((draft: EventFormDraft) => {
    if (!state.isPro && state.events.length >= 1) {
      navigate('ProUpgradeScreen', { from: 'EventCreateScreen' });
      return false;
    }

    const nextState = createEventWithSeeds(state, draft);
    persist(nextState);
    reset('EventDashboardScreen', { eventId: nextState.activeEventId, tab: 'home' });
    setActiveTab('home');
    return true;
  }, [navigate, persist, reset, state]);

  const updateEventAction = useCallback((draft: EventFormDraft) => {
    const nextState = updateEventWithTemplateDueDates(state, draft);
    persist(nextState);
    reset('EventDashboardScreen', { eventId: draft.id, tab: 'home' });
    setActiveTab('home');
  }, [persist, reset, state]);

  const deleteEventAction = useCallback((eventId: string) => {
    const nextState = deleteEventCascade(state, eventId);
    persist(nextState);
    reset(resolveBootRoute(nextState).name, resolveBootRoute(nextState).params);
  }, [persist, reset, state]);

  const openEvent = useCallback((eventId: string) => {
    const nextState = setActiveEvent(state, eventId);
    persist(nextState);
    reset('EventDashboardScreen', { eventId, tab: 'home' });
    setActiveTab('home');
  }, [persist, reset, state]);

  const addBudgetCategoryAction = useCallback((draft: BudgetCategoryDraft) => {
    persist(addBudgetCategory(state, draft));
  }, [persist, state]);

  const deleteBudgetCategoryAction = useCallback((categoryId: string) => {
    persist(deleteBudgetCategoryCascade(state, categoryId));
  }, [persist, state]);

  const saveBudgetItemAction = useCallback((draft: BudgetItemDraft) => {
    persist(upsertPhase1BudgetItem(state, draft));
    goBack();
  }, [goBack, persist, state]);

  const deleteBudgetItemAction = useCallback((itemId: string) => {
    persist(deletePhase1BudgetItem(state, itemId));
    goBack();
  }, [goBack, persist, state]);

  const saveChecklistItemAction = useCallback((draft: ChecklistItemDraft) => {
    persist(upsertChecklistItem(state, draft));
    goBack();
  }, [goBack, persist, state]);

  const setChecklistItemStatusAction = useCallback((itemId: string, nextStatus: ChecklistStatus) => {
    persist(setChecklistStatus(state, itemId, nextStatus));
  }, [persist, state]);

  const deleteChecklistItemAction = useCallback((itemId: string) => {
    persist(deleteChecklistItem(state, itemId));
    goBack();
  }, [goBack, persist, state]);

  const upgradeToPro = useCallback(() => {
    void billingClient.purchasePro()
      .then((result) => {
        if (!result.entitled) return;

        persist(setProStatus(state, true));
        goBack();
      })
      .catch(() => {
        setStatus('error');
        setErrorMessageKey('farha.phase1.errors.billing');
      });
  }, [goBack, persist, state]);

  const restorePurchase = useCallback(() => {
    void billingClient.restorePro()
      .then((result) => {
        if (result.entitled) persist(setProStatus(state, true));
      })
      .catch(() => {
        setStatus('error');
        setErrorMessageKey('farha.phase1.errors.billing');
      });
  }, [persist, state]);

  const setNotificationsEnabledAction = useCallback((enabled: boolean) => {
    persist(setNotificationsEnabled(state, enabled));
  }, [persist, state]);

  const clearAllData = useCallback(() => {
    repository.clear();
    const nextState = clearAllPhase1Data();
    persist(nextState);
    reset('OnboardingWelcomeScreen');
  }, [persist, reset]);

  const shareActiveEvent = useCallback(async () => {
    const event = getActiveEvent(state);
    if (!event) return;

    await Share.share({ message: createSharePayload(state, event.id) });
  }, [state]);

  return {
    status,
    state,
    route,
    activeTab,
    activeEvent,
    activeCategories,
    activeBudgetItems,
    activeChecklistItems,
    errorMessageKey,
    reload,
    navigate,
    replace,
    goBack,
    openTab,
    completeOnboarding: completeOnboardingAction,
    createEvent: createEventAction,
    updateEvent: updateEventAction,
    deleteEvent: deleteEventAction,
    openEvent,
    addBudgetCategory: addBudgetCategoryAction,
    deleteBudgetCategory: deleteBudgetCategoryAction,
    saveBudgetItem: saveBudgetItemAction,
    deleteBudgetItem: deleteBudgetItemAction,
    saveChecklistItem: saveChecklistItemAction,
    setChecklistItemStatus: setChecklistItemStatusAction,
    deleteChecklistItem: deleteChecklistItemAction,
    upgradeToPro,
    restorePurchase,
    setNotificationsEnabled: setNotificationsEnabledAction,
    clearAllData,
    shareActiveEvent,
    getEventById: (eventId) => getEventById(state, eventId),
    getCategoryById: (categoryId) => getCategoryById(state, categoryId),
    getBudgetItemById: (itemId) => getBudgetItemById(state, itemId),
    getChecklistItemById: (itemId) => getChecklistItemById(state, itemId),
    getEventCategories: (eventId) => getEventCategories(state, eventId),
    getCategoryItems: (categoryId) => getCategoryItems(state, categoryId),
    getEventBudgetItems: (eventId) => getEventBudgetItems(state, eventId),
    getEventChecklistItems: (eventId) => getEventChecklistItems(state, eventId),
    getChecklistSummary,
  };
};
