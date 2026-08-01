export type FarhaEventType = 'engagement' | 'wedding' | 'anniversary';

export type BudgetCategoryKey =
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

export interface FarhaEvent {
  id: string;
  type: FarhaEventType;
  title: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetCategory {
  id: string;
  eventId: string;
  key: BudgetCategoryKey;
  nameKey: string;
  isDefault: boolean;
  createdAt: string;
}

export interface BudgetItem {
  id: string;
  categoryId: string;
  title: string;
  plannedCost: number;
  actualCost: number;
  depositPaid: number;
  dueDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetItemDraft {
  id?: string;
  categoryId: string;
  title: string;
  plannedCost: number;
  actualCost: number;
  depositPaid: number;
  dueDate?: string;
  notes?: string;
}

export interface BudgetCategorySummary {
  category: BudgetCategory;
  plannedTotal: number;
  actualTotal: number;
  depositTotal: number;
  balanceTotal: number;
  itemCount: number;
}

export interface BudgetTotals {
  plannedTotal: number;
  actualTotal: number;
  depositTotal: number;
  balanceTotal: number;
  variance: number;
}

export interface FarhaBudgetState {
  schemaVersion: number;
  activeEventId: string;
  events: FarhaEvent[];
  categories: BudgetCategory[];
  items: BudgetItem[];
  updatedAt: string;
}

export interface BudgetValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof BudgetItemDraft, string>>;
}
