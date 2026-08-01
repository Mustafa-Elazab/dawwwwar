import type { BudgetCategoryKey, FarhaEventType } from '../../../types';

export interface DefaultBudgetCategory {
  key: BudgetCategoryKey;
  nameKey: string;
}

export const farhaEventTypes: FarhaEventType[] = ['engagement', 'wedding', 'anniversary'];

export const defaultBudgetCategories: DefaultBudgetCategory[] = [
  { key: 'venue', nameKey: 'farha.m1.categories.venue' },
  { key: 'hotel', nameKey: 'farha.m1.categories.hotel' },
  { key: 'dress', nameKey: 'farha.m1.categories.dress' },
  { key: 'groomSuit', nameKey: 'farha.m1.categories.groomSuit' },
  { key: 'makeup', nameKey: 'farha.m1.categories.makeup' },
  { key: 'grooming', nameKey: 'farha.m1.categories.grooming' },
  { key: 'gold', nameKey: 'farha.m1.categories.gold' },
  { key: 'catering', nameKey: 'farha.m1.categories.catering' },
  { key: 'photoVideo', nameKey: 'farha.m1.categories.photoVideo' },
  { key: 'entertainment', nameKey: 'farha.m1.categories.entertainment' },
  { key: 'gifts', nameKey: 'farha.m1.categories.gifts' },
  { key: 'other', nameKey: 'farha.m1.categories.other' },
];
