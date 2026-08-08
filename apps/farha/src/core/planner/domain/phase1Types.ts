export type ActivePhase1ScreenName =
  | 'SplashScreen'
  | 'OnboardingWelcomeScreen'
  | 'OccasionCreateScreen'
  | 'OccasionListScreen'
  | 'OccasionDashboardScreen'
  | 'OccasionEditScreen'
  | 'TaskListScreen'
  | 'TaskFormScreen'
  | 'ShareCardPreviewScreen'
  | 'ProUpgradeScreen'
  | 'SettingsScreen';

export type Phase1ScreenName = ActivePhase1ScreenName | LegacyPhase1ScreenName;

export type LegacyPhase1ScreenName =
  | 'EventCreateScreen'
  | 'EventListScreen'
  | 'EventDashboardScreen'
  | 'EventEditScreen'
  | 'BudgetCategoryListScreen'
  | 'BudgetItemListScreen'
  | 'BudgetItemFormScreen'
  | 'ChecklistTimelineScreen'
  | 'ChecklistItemEditScreen'
  | 'SavingsFundScreen'
  | 'SavingsContributionFormScreen'
  | 'SavingsAllocationScreen';

export type Phase1TabKey = 'home' | 'tasks' | 'share' | 'settings';

export type FarhaPhase1OccasionType =
  | 'engagement'
  | 'wedding'
  | 'anniversary'
  | 'graduation'
  | 'other';

export type FarhaPhase1EventType = FarhaPhase1OccasionType;

export type FarhaPhase1TaskCategoryKey =
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

export type FarhaPhase1BudgetCategoryKey = FarhaPhase1TaskCategoryKey;
export type TaskStatus = 'pending' | 'done' | 'skipped';
export type ChecklistStatus = TaskStatus;
export type TaskSource = 'template' | 'custom';
export type ChecklistSource = TaskSource;
export type TaskPaymentStatus = 'unpaid' | 'partial' | 'paid';
export type BudgetItemPaymentStatus = TaskPaymentStatus;
export type BudgetBadgeStatus = 'over' | 'on';

export interface Phase1Route {
  name: Phase1ScreenName;
  params?: {
    occasionId?: string;
    eventId?: string;
    categoryId?: string;
    taskId?: string;
    budgetItemId?: string;
    checklistItemId?: string;
    contributionId?: string;
    from?: Phase1ScreenName;
    tab?: Phase1TabKey;
  };
}

export interface FarhaPhase1Occasion {
  id: string;
  type: FarhaPhase1OccasionType;
  title: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export type FarhaPhase1Event = FarhaPhase1Occasion;

export interface TaskPaymentPlan {
  monthlyAmount: number;
  nextDueDate: string;
}

export interface FarhaPhase1Task {
  id: string;
  occasionId: string;
  title: string;
  titleKey?: string;
  category?: FarhaPhase1TaskCategoryKey;
  customCategory?: string;
  dueDate?: string;
  offsetDaysBeforeOccasion?: number;
  status: TaskStatus;
  source: TaskSource;
  plannedCost?: number;
  actualCost?: number;
  depositPaid: number;
  paymentPlan?: TaskPaymentPlan;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FarhaPhase1BudgetCategory {
  id: string;
  eventId: string;
  key?: FarhaPhase1TaskCategoryKey;
  nameKey?: string;
  customName?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export type FarhaPhase1BudgetItem = FarhaPhase1Task & {
  categoryId?: string;
  name?: string;
};

export type FarhaPhase1ChecklistItem = FarhaPhase1Task & {
  eventId?: string;
  categoryId?: string;
  offsetDaysBeforeEvent?: number;
  notificationId?: string;
};

export interface FarhaPhase1ScheduledNotification {
  id: string;
  occasionId: string;
  taskId: string;
  fireAt: string;
  title: string;
}

export interface FarhaPhase1SavingsContribution {
  id: string;
  eventId: string;
  amount: number;
  date: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FarhaPhase1SavingsAllocation {
  id: string;
  eventId: string;
  budgetItemId: string;
  amount: number;
  date: string;
  createdAt: string;
}

export interface FarhaPhase1State {
  schemaVersion: number;
  hasOnboarded: boolean;
  isPro: boolean;
  notificationsEnabled: boolean;
  activeOccasionId?: string;
  occasions: FarhaPhase1Occasion[];
  tasks: FarhaPhase1Task[];
  scheduledNotifications: FarhaPhase1ScheduledNotification[];
  lastInterstitialShownAt?: string;
  updatedAt: string;
}

export interface LegacyPhase1State {
  schemaVersion?: number;
  hasOnboarded?: boolean;
  isPro?: boolean;
  notificationsEnabled?: boolean;
  activeEventId?: string;
  events?: FarhaPhase1Event[];
  budgetCategories?: FarhaPhase1BudgetCategory[];
  budgetItems?: FarhaPhase1BudgetItem[];
  checklistItems?: FarhaPhase1ChecklistItem[];
  scheduledNotifications?: Array<
    FarhaPhase1ScheduledNotification | {
      id: string;
      eventId: string;
      checklistItemId: string;
      fireAt: string;
      title: string;
    }
  >;
  savingsContributions?: FarhaPhase1SavingsContribution[];
  savingsAllocations?: FarhaPhase1SavingsAllocation[];
  lastInterstitialShownAt?: string;
  updatedAt?: string;
}

export interface OccasionFormDraft {
  id?: string;
  type: FarhaPhase1OccasionType;
  title: string;
  date: string;
}

export type EventFormDraft = OccasionFormDraft;

export interface TaskDraft {
  id?: string;
  occasionId: string;
  title: string;
  category?: FarhaPhase1TaskCategoryKey;
  customCategory?: string;
  dueDate?: string;
  notes?: string;
  status: TaskStatus;
  plannedCost?: number;
  actualCost?: number;
  depositPaid?: number;
  paymentPlan?: TaskPaymentPlan;
}

export interface TaskPaymentInput {
  taskId: string;
  amount: number;
  paidAt?: string;
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

export interface SavingsContributionDraft {
  id?: string;
  eventId: string;
  amount: number;
  date: string;
  note?: string;
}

export interface SavingsAllocationInput {
  budgetItemId: string;
  amount: number;
}

export interface SavingsSummary {
  balance: number;
  contributedThisMonth: number;
  monthlyGoal?: number;
  monthlyProgress: number;
}

export interface BudgetTotals {
  plannedTotal: number;
  actualTotal: number;
  depositTotal: number;
  balanceTotal: number;
  badge: BudgetBadgeStatus;
}

export interface TaskSummary {
  doneCount: number;
  actionableTotal: number;
  totalCount: number;
  skippedCount: number;
  nextPending?: FarhaPhase1Task;
  totals: BudgetTotals;
}

export type ChecklistSummary = Omit<TaskSummary, 'totals'>;

export interface ValidationResult<T extends string> {
  isValid: boolean;
  errors: Partial<Record<T, string>>;
  warnings: Partial<Record<T, string>>;
}
