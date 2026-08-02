export type Phase1ScreenName =
  | 'SplashScreen'
  | 'OnboardingWelcomeScreen'
  | 'EventCreateScreen'
  | 'EventListScreen'
  | 'EventDashboardScreen'
  | 'EventEditScreen'
  | 'BudgetCategoryListScreen'
  | 'BudgetItemListScreen'
  | 'BudgetItemFormScreen'
  | 'ChecklistTimelineScreen'
  | 'ChecklistItemEditScreen'
  | 'ShareCardPreviewScreen'
  | 'ProUpgradeScreen'
  | 'SettingsScreen';

export type Phase1TabKey = 'home' | 'budget' | 'checklist' | 'settings';

export type FarhaPhase1EventType = 'engagement' | 'wedding' | 'anniversary' | 'other';

export type FarhaPhase1BudgetCategoryKey =
  | 'venue'
  | 'hotel'
  | 'dress'
  | 'groomSuit'
  | 'makeup'
  | 'grooming'
  | 'gold'
  | 'catering'
  | 'photoVideo'
  | 'entertainment'
  | 'gifts'
  | 'other';

export type ChecklistStatus = 'pending' | 'done' | 'skipped';
export type ChecklistSource = 'template' | 'custom';
export type BudgetItemPaymentStatus = 'unpaid' | 'partial' | 'paid';
export type BudgetBadgeStatus = 'over' | 'on';

export interface Phase1Route {
  name: Phase1ScreenName;
  params?: {
    eventId?: string;
    categoryId?: string;
    budgetItemId?: string;
    checklistItemId?: string;
    from?: Phase1ScreenName;
    tab?: Phase1TabKey;
  };
}

export interface FarhaPhase1Event {
  id: string;
  type: FarhaPhase1EventType;
  title: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface FarhaPhase1BudgetCategory {
  id: string;
  eventId: string;
  key?: FarhaPhase1BudgetCategoryKey;
  nameKey?: string;
  customName?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FarhaPhase1BudgetItem {
  id: string;
  categoryId: string;
  name: string;
  plannedCost: number;
  actualCost?: number;
  depositPaid: number;
  dueDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FarhaPhase1ChecklistItem {
  id: string;
  eventId: string;
  categoryId?: string;
  title: string;
  titleKey?: string;
  dueDate?: string;
  offsetDaysBeforeEvent?: number;
  status: ChecklistStatus;
  source: ChecklistSource;
  notes?: string;
  notificationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FarhaPhase1ScheduledNotification {
  id: string;
  eventId: string;
  checklistItemId: string;
  fireAt: string;
  title: string;
}

export interface FarhaPhase1State {
  schemaVersion: number;
  hasOnboarded: boolean;
  isPro: boolean;
  notificationsEnabled: boolean;
  activeEventId?: string;
  events: FarhaPhase1Event[];
  budgetCategories: FarhaPhase1BudgetCategory[];
  budgetItems: FarhaPhase1BudgetItem[];
  checklistItems: FarhaPhase1ChecklistItem[];
  scheduledNotifications: FarhaPhase1ScheduledNotification[];
  lastInterstitialShownAt?: string;
  updatedAt: string;
}

export interface EventFormDraft {
  id?: string;
  type: FarhaPhase1EventType;
  title: string;
  date: string;
}

export interface BudgetCategoryDraft {
  eventId: string;
  name: string;
}

export interface BudgetItemDraft {
  id?: string;
  categoryId: string;
  name: string;
  plannedCost: number;
  actualCost?: number;
  depositPaid: number;
  dueDate?: string;
  notes?: string;
}

export interface ChecklistItemDraft {
  id?: string;
  eventId: string;
  categoryId?: string;
  title: string;
  dueDate?: string;
  notes?: string;
}

export interface BudgetTotals {
  plannedTotal: number;
  actualTotal: number;
  depositTotal: number;
  balanceTotal: number;
  badge: BudgetBadgeStatus;
}

export interface ChecklistSummary {
  doneCount: number;
  actionableTotal: number;
  totalCount: number;
  skippedCount: number;
  nextPending?: FarhaPhase1ChecklistItem;
}

export interface ValidationResult<T extends string> {
  isValid: boolean;
  errors: Partial<Record<T, string>>;
  warnings: Partial<Record<T, string>>;
}
