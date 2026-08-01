import {
  createFarhaBudgetRepository,
  createInitialBudgetState,
  ensureEventForType,
  getActiveEvent,
  getCategoriesForEvent,
  getItemsForEvent,
  type FarhaKeyValueStore,
  upsertBudgetItem,
} from '../src/core/database/farhaBudgetRepository';
import { FARHA_BUDGET_STORAGE_KEY } from '../src/core/database/farhaDatabaseSchema';
import { defaultBudgetCategories } from '../src/features/budget/data/defaultBudgetCategories';
import {
  calculateBudgetTotals,
  parseCurrencyInput,
  validateBudgetItemDraft,
} from '../src/features/budget/domain/budgetTotals';

class MemoryStore implements FarhaKeyValueStore {
  private values = new Map<string, string>();

  getString(key: string) {
    return this.values.get(key);
  }

  set(key: string, value: string) {
    this.values.set(key, value);
  }
}

describe('Farha M1 budget planner', () => {
  const now = new Date('2026-08-01T08:00:00.000Z');

  it('seeds a wedding event with all default budget categories', () => {
    const state = createInitialBudgetState(now);
    const activeEvent = getActiveEvent(state);
    const categories = getCategoriesForEvent(state, activeEvent.id);

    expect(activeEvent.type).toBe('wedding');
    expect(categories).toHaveLength(defaultBudgetCategories.length);
    expect(categories.map((category) => category.key)).toEqual(
      defaultBudgetCategories.map((category) => category.key),
    );
  });

  it('creates and switches event types without losing existing budget items', () => {
    const initialState = createInitialBudgetState(now);
    const weddingCategory = getCategoriesForEvent(initialState, initialState.activeEventId)[0];
    const withItem = upsertBudgetItem(initialState, {
      categoryId: weddingCategory.id,
      title: 'Hall booking',
      plannedCost: 100000,
      actualCost: 120000,
      depositPaid: 20000,
    }, now);

    const engagementState = ensureEventForType(withItem, 'engagement', now);
    const engagementEvent = getActiveEvent(engagementState);
    const backToWeddingState = ensureEventForType(engagementState, 'wedding', now);

    expect(engagementEvent.type).toBe('engagement');
    expect(getCategoriesForEvent(engagementState, engagementEvent.id)).toHaveLength(
      defaultBudgetCategories.length,
    );
    expect(getItemsForEvent(backToWeddingState, initialState.activeEventId)).toHaveLength(1);
  });

  it('calculates running totals, deposits, balances, and variance', () => {
    const initialState = createInitialBudgetState(now);
    const category = getCategoriesForEvent(initialState, initialState.activeEventId)[0];
    const state = upsertBudgetItem(initialState, {
      categoryId: category.id,
      title: 'Dress deposit',
      plannedCost: parseCurrencyInput('15,000'),
      actualCost: parseCurrencyInput('17,500'),
      depositPaid: parseCurrencyInput('5,000'),
    }, now);

    expect(calculateBudgetTotals(state.items)).toEqual({
      plannedTotal: 15000,
      actualTotal: 17500,
      depositTotal: 5000,
      balanceTotal: 12500,
      variance: -2500,
    });
  });

  it('validates required fields and impossible deposits', () => {
    expect(validateBudgetItemDraft({
      categoryId: '',
      title: '',
      plannedCost: Number.NaN,
      actualCost: 1000,
      depositPaid: 1200,
    })).toEqual({
      isValid: false,
      errors: {
        categoryId: 'required',
        title: 'required',
        plannedCost: 'invalidAmount',
        depositPaid: 'depositOverActual',
      },
    });
  });

  it('persists and reloads the local budget state', () => {
    const store = new MemoryStore();
    const repository = createFarhaBudgetRepository(store);
    const loaded = repository.load();
    const category = getCategoriesForEvent(loaded, loaded.activeEventId)[0];
    const withItem = upsertBudgetItem(loaded, {
      categoryId: category.id,
      title: 'Photographer',
      plannedCost: 25000,
      actualCost: 25000,
      depositPaid: 5000,
    }, now);

    repository.save(withItem);

    expect(store.getString(FARHA_BUDGET_STORAGE_KEY)).toContain('Photographer');
    expect(createFarhaBudgetRepository(store).load().items).toHaveLength(1);
  });
});
