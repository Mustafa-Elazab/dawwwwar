import { useCallback, useEffect, useMemo, useState } from 'react';
import { Share } from 'react-native';

import {
  addBudgetCategory,
  clearAllPhase1Data,
  confirmSavingsAllocations,
  completeOnboarding,
  createEventWithSeeds,
  createSharePayload,
  deleteBudgetCategoryCascade,
  deleteChecklistItem,
  deleteEventCascade,
  deletePhase1BudgetItem,
  deleteSavingsContribution,
  getAllocatableBudgetItems,
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
  getEventSavingsAllocations,
  getEventSavingsContributions,
  getSavingsContributionById,
  getSavingsSummary,
  resolveBootRoute,
  setActiveEvent,
  setChecklistStatus,
  setNotificationsEnabled,
  setProStatus,
  setSavingsMonthlyGoal,
  suggestSavingsAllocations,
  updateEventWithTemplateDueDates,
  upsertChecklistItem,
  upsertPhase1BudgetItem,
  upsertSavingsContribution,
} from './domain/phase1Logic';
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
  FarhaPhase1SavingsAllocation,
  FarhaPhase1SavingsContribution,
  FarhaPhase1State,
  Phase1Route,
  Phase1ScreenName,
  Phase1TabKey,
  SavingsAllocationInput,
  SavingsContributionDraft,
} from './domain/phase1Types';
import { createPhase1BillingClient } from '../../features/monetization/data/phase1Billing';
import {
  logFarhaEvent,
  recordFarhaError,
  traceFarhaBootLoad,
} from '../firebase/farhaFirebase';
import { showBudgetItemSavedInterstitial } from '../../features/monetization/ads/interstitialAds';
import { createPhase1Repository } from './data/phase1Repository';
import { getPlannerTabForScreen, PLANNER_TAB_SCREEN_BY_KEY } from '../../navigation/plannerTabs';

export type Phase1Status = 'loading' | 'ready' | 'error';

export interface Phase1PlannerController {
  status: Phase1Status;
  state: FarhaPhase1State;
  route: Phase1Route;
  activeTab: Phase1TabKey;
  canGoBack: boolean;
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
  saveSavingsContribution: (draft: SavingsContributionDraft) => void;
  deleteSavingsContribution: (contributionId: string) => void;
  setSavingsMonthlyGoal: (eventId: string, monthlyGoal: number | undefined) => void;
  confirmSavingsAllocations: (eventId: string, inputs: SavingsAllocationInput[]) => void;
  upgradeToPro: () => void;
  restorePurchase: () => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  clearAllData: () => void;
  shareActiveEvent: () => Promise<void>;
  getEventById: (eventId?: string) => FarhaPhase1Event | undefined;
  getCategoryById: (categoryId?: string) => FarhaPhase1BudgetCategory | undefined;
  getBudgetItemById: (itemId?: string) => FarhaPhase1BudgetItem | undefined;
  getChecklistItemById: (itemId?: string) => FarhaPhase1ChecklistItem | undefined;
  getSavingsContributionById: (contributionId?: string) => FarhaPhase1SavingsContribution | undefined;
  getEventCategories: (eventId?: string) => FarhaPhase1BudgetCategory[];
  getCategoryItems: (categoryId?: string) => FarhaPhase1BudgetItem[];
  getEventBudgetItems: (eventId?: string) => FarhaPhase1BudgetItem[];
  getEventChecklistItems: (eventId?: string) => FarhaPhase1ChecklistItem[];
  getEventSavingsContributions: (eventId?: string) => FarhaPhase1SavingsContribution[];
  getEventSavingsAllocations: (eventId?: string) => FarhaPhase1SavingsAllocation[];
  getSavingsSummary: (eventId?: string) => ReturnType<typeof getSavingsSummary>;
  getAllocatableBudgetItems: (eventId?: string) => FarhaPhase1BudgetItem[];
  suggestSavingsAllocations: (eventId: string) => SavingsAllocationInput[];
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
      recordFarhaError(new Error('Farha local state save failed'), 'farha_local_db_save_failed');
      setStatus('error');
      setErrorMessageKey('farha.phase1.errors.save');
    }
  }, []);

  const reload = useCallback(() => {
    try {
      setStatus('loading');
      const loaded = traceFarhaBootLoad(() => repository.load());
      setState(loaded);
      setRoutes([{ name: 'SplashScreen' }]);
      setStatus('ready');
      setErrorMessageKey(undefined);
    } catch (error) {
      recordFarhaError(error, 'farha_local_db_load_failed');
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

  useEffect(() => {
    const routeTab = getPlannerTabForScreen(route.name);
    if (routeTab) {
      setActiveTab(routeTab);
    }
  }, [route.name]);

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
    setActiveTab(tab);
    reset(PLANNER_TAB_SCREEN_BY_KEY[tab], { eventId: state.activeEventId, tab });
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
    logFarhaEvent('event_created');
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
    const isNewItem = !draft.id;
    persist(upsertPhase1BudgetItem(state, draft));
    if (isNewItem) logFarhaEvent('budget_item_added');
    showBudgetItemSavedInterstitial(state.isPro);
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
    if (nextStatus === 'done') logFarhaEvent('checklist_task_completed');
  }, [persist, state]);

  const deleteChecklistItemAction = useCallback((itemId: string) => {
    persist(deleteChecklistItem(state, itemId));
    goBack();
  }, [goBack, persist, state]);

  const saveSavingsContributionAction = useCallback((draft: SavingsContributionDraft) => {
    persist(upsertSavingsContribution(state, draft));
    logFarhaEvent('savings_contribution_added');
    goBack();
  }, [goBack, persist, state]);

  const deleteSavingsContributionAction = useCallback((contributionId: string) => {
    persist(deleteSavingsContribution(state, contributionId));
    goBack();
  }, [goBack, persist, state]);

  const setSavingsMonthlyGoalAction = useCallback((
    eventId: string,
    monthlyGoal: number | undefined,
  ) => {
    persist(setSavingsMonthlyGoal(state, eventId, monthlyGoal));
  }, [persist, state]);

  const confirmSavingsAllocationsAction = useCallback((
    eventId: string,
    inputs: SavingsAllocationInput[],
  ) => {
    persist(confirmSavingsAllocations(state, eventId, inputs));
    logFarhaEvent('savings_allocation_confirmed');
    goBack();
  }, [goBack, persist, state]);

  const upgradeToPro = useCallback(() => {
    void billingClient.purchasePro()
      .then((result) => {
        if (!result.entitled) return;

        persist(setProStatus(state, true));
        logFarhaEvent('pro_purchase_completed');
        goBack();
      })
      .catch((error) => {
        recordFarhaError(error, 'farha_billing_purchase_failed');
        setStatus('error');
        setErrorMessageKey('farha.phase1.errors.billing');
      });
  }, [goBack, persist, state]);

  const restorePurchase = useCallback(() => {
    void billingClient.restorePro()
      .then((result) => {
        if (result.entitled) persist(setProStatus(state, true));
      })
      .catch((error) => {
        recordFarhaError(error, 'farha_billing_restore_failed');
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
    logFarhaEvent('share_completed');
  }, [state]);

  return {
    status,
    state,
    route,
    activeTab,
    canGoBack: routes.length > 1,
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
    saveSavingsContribution: saveSavingsContributionAction,
    deleteSavingsContribution: deleteSavingsContributionAction,
    setSavingsMonthlyGoal: setSavingsMonthlyGoalAction,
    confirmSavingsAllocations: confirmSavingsAllocationsAction,
    upgradeToPro,
    restorePurchase,
    setNotificationsEnabled: setNotificationsEnabledAction,
    clearAllData,
    shareActiveEvent,
    getEventById: (eventId) => getEventById(state, eventId),
    getCategoryById: (categoryId) => getCategoryById(state, categoryId),
    getBudgetItemById: (itemId) => getBudgetItemById(state, itemId),
    getChecklistItemById: (itemId) => getChecklistItemById(state, itemId),
    getSavingsContributionById: (contributionId) => getSavingsContributionById(state, contributionId),
    getEventCategories: (eventId) => getEventCategories(state, eventId),
    getCategoryItems: (categoryId) => getCategoryItems(state, categoryId),
    getEventBudgetItems: (eventId) => getEventBudgetItems(state, eventId),
    getEventChecklistItems: (eventId) => getEventChecklistItems(state, eventId),
    getEventSavingsContributions: (eventId) => getEventSavingsContributions(state, eventId),
    getEventSavingsAllocations: (eventId) => getEventSavingsAllocations(state, eventId),
    getSavingsSummary: (eventId) => getSavingsSummary(state, eventId),
    getAllocatableBudgetItems: (eventId) => getAllocatableBudgetItems(state, eventId),
    suggestSavingsAllocations: (eventId) => suggestSavingsAllocations(state, eventId),
    getChecklistSummary,
  };
};
