import { useCallback, useEffect, useMemo, useState } from 'react';

import { farhaStorage } from '../../../app/storage';
import {
  createFarhaBudgetRepository,
  ensureEventForType,
  getActiveEvent,
  getCategoriesForEvent,
  getItemsForEvent,
  upsertBudgetItem,
} from '../../../core/database/farhaBudgetRepository';
import type {
  BudgetCategory,
  BudgetCategorySummary,
  BudgetItem,
  BudgetItemDraft,
  BudgetTotals,
  FarhaBudgetState,
  FarhaEvent,
  FarhaEventType,
} from '../../../types';
import {
  calculateBudgetTotals,
  summarizeBudgetCategories,
} from '../domain/budgetTotals';

type PlannerStatus = 'loading' | 'ready' | 'error';

export interface BudgetPlannerViewModel {
  status: PlannerStatus;
  state?: FarhaBudgetState;
  activeEvent?: FarhaEvent;
  categories: BudgetCategory[];
  items: BudgetItem[];
  categorySummaries: BudgetCategorySummary[];
  totals: BudgetTotals;
  errorMessageKey?: string;
}

export interface BudgetPlannerController extends BudgetPlannerViewModel {
  reload: () => void;
  selectOrCreateEventType: (type: FarhaEventType) => void;
  saveBudgetItem: (draft: BudgetItemDraft) => void;
}

const emptyTotals: BudgetTotals = {
  plannedTotal: 0,
  actualTotal: 0,
  depositTotal: 0,
  balanceTotal: 0,
  variance: 0,
};

export const useBudgetPlanner = (): BudgetPlannerController => {
  const repository = useMemo(() => createFarhaBudgetRepository(farhaStorage), []);
  const [viewModel, setViewModel] = useState<BudgetPlannerViewModel>({
    status: 'loading',
    categories: [],
    items: [],
    categorySummaries: [],
    totals: emptyTotals,
  });

  const buildViewModel = useCallback((state: FarhaBudgetState): BudgetPlannerViewModel => {
    const activeEvent = getActiveEvent(state);
    const categories = getCategoriesForEvent(state, activeEvent.id);
    const items = getItemsForEvent(state, activeEvent.id);

    return {
      status: 'ready',
      state,
      activeEvent,
      categories,
      items,
      categorySummaries: summarizeBudgetCategories(categories, items),
      totals: calculateBudgetTotals(items),
    };
  }, []);

  const load = useCallback(() => {
    try {
      setViewModel((current) => ({ ...current, status: 'loading', errorMessageKey: undefined }));
      setViewModel(buildViewModel(repository.load()));
    } catch {
      setViewModel({
        status: 'error',
        categories: [],
        items: [],
        categorySummaries: [],
        totals: emptyTotals,
        errorMessageKey: 'farha.m1.states.loadError',
      });
    }
  }, [buildViewModel, repository]);

  const persist = useCallback(
    (state: FarhaBudgetState) => {
      repository.save(state);
      setViewModel(buildViewModel(state));
    },
    [buildViewModel, repository],
  );

  const selectOrCreateEventType = useCallback(
    (type: FarhaEventType) => {
      if (!viewModel.state) return;

      try {
        persist(ensureEventForType(viewModel.state, type));
      } catch {
        setViewModel((current) => ({
          ...current,
          status: 'error',
          errorMessageKey: 'farha.m1.states.saveError',
        }));
      }
    },
    [persist, viewModel.state],
  );

  const saveBudgetItem = useCallback(
    (draft: BudgetItemDraft) => {
      if (!viewModel.state) return;

      try {
        persist(upsertBudgetItem(viewModel.state, draft));
      } catch {
        setViewModel((current) => ({
          ...current,
          status: 'error',
          errorMessageKey: 'farha.m1.states.saveError',
        }));
      }
    },
    [persist, viewModel.state],
  );

  useEffect(() => {
    load();
  }, [load]);

  return {
    ...viewModel,
    reload: load,
    selectOrCreateEventType,
    saveBudgetItem,
  };
};
