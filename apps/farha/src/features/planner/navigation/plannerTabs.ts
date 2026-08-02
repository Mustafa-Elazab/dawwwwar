import type { Phase1ScreenName, Phase1TabKey } from '../domain/phase1Types';

interface PlannerTabConfig {
  activeIcon: string;
  inactiveIcon: string;
  labelKey: string;
  screenName: Phase1ScreenName;
}

export const PLANNER_TAB_KEYS: Phase1TabKey[] = ['home', 'budget', 'checklist', 'settings'];

export const PLANNER_TAB_CONFIG: Record<Phase1TabKey, PlannerTabConfig> = {
  home: {
    activeIcon: 'home',
    inactiveIcon: 'home-outline',
    labelKey: 'farha.phase1.tabs.home',
    screenName: 'EventDashboardScreen',
  },
  budget: {
    activeIcon: 'wallet',
    inactiveIcon: 'wallet-outline',
    labelKey: 'farha.phase1.tabs.budget',
    screenName: 'BudgetCategoryListScreen',
  },
  checklist: {
    activeIcon: 'clipboard-check',
    inactiveIcon: 'clipboard-check-outline',
    labelKey: 'farha.phase1.tabs.checklist',
    screenName: 'ChecklistTimelineScreen',
  },
  settings: {
    activeIcon: 'cog',
    inactiveIcon: 'cog-outline',
    labelKey: 'farha.phase1.tabs.settings',
    screenName: 'SettingsScreen',
  },
};

export const PLANNER_TAB_SCREEN_BY_KEY: Record<Phase1TabKey, Phase1ScreenName> = {
  home: PLANNER_TAB_CONFIG.home.screenName,
  budget: PLANNER_TAB_CONFIG.budget.screenName,
  checklist: PLANNER_TAB_CONFIG.checklist.screenName,
  settings: PLANNER_TAB_CONFIG.settings.screenName,
};

export const getPlannerTabForScreen = (screenName: Phase1ScreenName) =>
  PLANNER_TAB_KEYS.find((tab) => PLANNER_TAB_CONFIG[tab].screenName === screenName);
