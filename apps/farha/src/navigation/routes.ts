export const FARHA_ROOT_ROUTES = {
  SPLASH: 'SplashScreen',
  ONBOARDING: 'OnboardingWelcomeScreen',
  EVENT_CREATE: 'EventCreateScreen',
  EVENT_LIST: 'EventListScreen',
  EVENT_EDIT: 'EventEditScreen',
  BUDGET_ITEM_LIST: 'BudgetItemListScreen',
  BUDGET_ITEM_FORM: 'BudgetItemFormScreen',
  CHECKLIST_ITEM_EDIT: 'ChecklistItemEditScreen',
  SHARE_CARD_PREVIEW: 'ShareCardPreviewScreen',
  PRO_UPGRADE: 'ProUpgradeScreen',
  TABS: 'FarhaTabs',
} as const;

export const FARHA_TAB_ROUTES = {
  HOME: 'EventDashboardScreen',
  BUDGET: 'BudgetCategoryListScreen',
  CHECKLIST: 'ChecklistTimelineScreen',
  SETTINGS: 'SettingsScreen',
} as const;
