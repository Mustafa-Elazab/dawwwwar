import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from '@dawwar/i18n';

import { farhaStorage } from '../../../../app/storage';
import {
  createFarhaBudgetRepository,
  ensureEventForType,
  getActiveEvent,
  getCategoriesForEvent,
  getItemsForEvent,
  upsertBudgetItem,
} from '../../../../core/database/farhaBudgetRepository';
import type {
  BudgetCategory,
  BudgetCategorySummary,
  BudgetItem,
  BudgetItemDraft,
  BudgetTotals,
  FarhaBudgetState,
  FarhaEvent,
  FarhaEventType,
} from '../../../../types';
import {
  calculateBudgetTotals,
  formatBudgetAmount,
  parseCurrencyInput,
  summarizeBudgetCategories,
  validateBudgetItemDraft,
} from '../../domain/budgetTotals';
import { farhaEventTypes } from '../../data/defaultBudgetCategories';

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

interface BudgetItemFormState {
  categoryId: string;
  title: string;
  plannedCost: string;
  actualCost: string;
  depositPaid: string;
  dueDate: string;
  notes: string;
}

const emptyForm: BudgetItemFormState = {
  categoryId: '',
  title: '',
  plannedCost: '',
  actualCost: '',
  depositPaid: '',
  dueDate: '',
  notes: '',
};

const emptyTotals: BudgetTotals = {
  plannedTotal: 0,
  actualTotal: 0,
  depositTotal: 0,
  balanceTotal: 0,
  variance: 0,
};

const useBudgetPlannerState = (): BudgetPlannerController => {
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

export const useController = () => {
  const { t } = useTranslation();
  const planner = useBudgetPlannerState();
  const [form, setForm] = useState<BudgetItemFormState>(emptyForm);
  const [editingItemId, setEditingItemId] = useState<string | undefined>();
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (!planner.categories.length) return;

    setForm((current) => {
      const hasCurrentCategory = planner.categories.some(
        (category) => category.id === current.categoryId,
      );

      if (hasCurrentCategory) return current;

      return {
        ...current,
        categoryId: planner.categories[0].id,
      };
    });
  }, [planner.categories]);

  const draft = useMemo((): BudgetItemDraft => ({
    id: editingItemId,
    categoryId: form.categoryId,
    title: form.title,
    plannedCost: parseCurrencyInput(form.plannedCost),
    actualCost: parseCurrencyInput(form.actualCost),
    depositPaid: parseCurrencyInput(form.depositPaid),
    dueDate: form.dueDate,
    notes: form.notes,
  }), [editingItemId, form]);

  const validation = useMemo(() => validateBudgetItemDraft(draft), [draft]);
  const selectedCategory = planner.categories.find((category) => category.id === form.categoryId);
  const eventTabs = useMemo(
    () =>
      farhaEventTypes.map((type) => ({
        key: type,
        label: t(`farha.m1.events.${type}`),
      })),
    [t],
  );

  const resetForm = useCallback((categories: BudgetCategory[]) => {
    setEditingItemId(undefined);
    setHasSubmitted(false);
    setForm({
      ...emptyForm,
      categoryId: categories[0]?.id ?? '',
    });
  }, []);

  const submit = () => {
    setHasSubmitted(true);

    if (!validation.isValid) return;

    planner.saveBudgetItem(draft);
    resetForm(planner.categories);
  };

  const editItem = (item: BudgetItem) => {
    setEditingItemId(item.id);
    setHasSubmitted(false);
    setForm({
      categoryId: item.categoryId,
      title: item.title,
      plannedCost: item.plannedCost ? String(item.plannedCost) : '',
      actualCost: item.actualCost ? String(item.actualCost) : '',
      depositPaid: item.depositPaid ? String(item.depositPaid) : '',
      dueDate: item.dueDate ?? '',
      notes: item.notes ?? '',
    });
  };

  const getFieldError = (field: keyof BudgetItemDraft): string | undefined => {
    if (!hasSubmitted) return undefined;

    const errorKey = validation.errors[field];
    return errorKey ? t(`farha.m1.validation.${errorKey}`) : undefined;
  };

  const renderAmount = (amount: number) =>
    `${formatBudgetAmount(amount)} ${t('farha.m1.currencySuffix')}`;

  const activeEventName = planner.activeEvent
    ? t(planner.activeEvent.title)
    : t('farha.m1.events.wedding');

  return {
    ...planner,
    form,
    editingItemId,
    hasSubmitted,
    draft,
    validation,
    selectedCategory,
    eventTabs,
    activeEventName,
    setForm,
    submit,
    editItem,
    resetForm: () => resetForm(planner.categories),
    getFieldError,
    renderAmount,
  };
};
