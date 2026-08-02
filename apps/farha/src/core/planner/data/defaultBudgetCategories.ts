import type { FarhaPhase1BudgetCategoryKey } from '../domain/phase1Types';

export interface DefaultPhase1BudgetCategory {
  key: FarhaPhase1BudgetCategoryKey;
  nameKey: string;
}

export const defaultPhase1BudgetCategories: DefaultPhase1BudgetCategory[] = [
  { key: 'venue', nameKey: 'farha.phase1.categories.venue' },
  { key: 'hotel', nameKey: 'farha.phase1.categories.hotel' },
  { key: 'dress', nameKey: 'farha.phase1.categories.dress' },
  { key: 'groomSuit', nameKey: 'farha.phase1.categories.groomSuit' },
  { key: 'makeup', nameKey: 'farha.phase1.categories.makeup' },
  { key: 'grooming', nameKey: 'farha.phase1.categories.grooming' },
  { key: 'gold', nameKey: 'farha.phase1.categories.gold' },
  { key: 'catering', nameKey: 'farha.phase1.categories.catering' },
  { key: 'photoVideo', nameKey: 'farha.phase1.categories.photoVideo' },
  { key: 'entertainment', nameKey: 'farha.phase1.categories.entertainment' },
  { key: 'gifts', nameKey: 'farha.phase1.categories.gifts' },
  { key: 'other', nameKey: 'farha.phase1.categories.other' },
];
