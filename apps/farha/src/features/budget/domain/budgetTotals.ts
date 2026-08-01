import type {
  BudgetCategory,
  BudgetCategorySummary,
  BudgetItem,
  BudgetItemDraft,
  BudgetTotals,
  BudgetValidationResult,
} from '../../../types';

export const calculateBudgetTotals = (items: BudgetItem[]): BudgetTotals => {
  const plannedTotal = sumBy(items, (item) => item.plannedCost);
  const actualTotal = sumBy(items, (item) => item.actualCost);
  const depositTotal = sumBy(items, (item) => item.depositPaid);
  const balanceTotal = sumBy(items, (item) => Math.max(item.actualCost - item.depositPaid, 0));

  return {
    plannedTotal,
    actualTotal,
    depositTotal,
    balanceTotal,
    variance: plannedTotal - actualTotal,
  };
};

export const summarizeBudgetCategories = (
  categories: BudgetCategory[],
  items: BudgetItem[],
): BudgetCategorySummary[] =>
  categories.map((category) => {
    const categoryItems = items.filter((item) => item.categoryId === category.id);
    const totals = calculateBudgetTotals(categoryItems);

    return {
      category,
      plannedTotal: totals.plannedTotal,
      actualTotal: totals.actualTotal,
      depositTotal: totals.depositTotal,
      balanceTotal: totals.balanceTotal,
      itemCount: categoryItems.length,
    };
  });

export const validateBudgetItemDraft = (draft: BudgetItemDraft): BudgetValidationResult => {
  const errors: BudgetValidationResult['errors'] = {};

  if (!draft.categoryId.trim()) {
    errors.categoryId = 'required';
  }

  if (!draft.title.trim()) {
    errors.title = 'required';
  }

  if (!isFiniteCurrencyValue(draft.plannedCost)) {
    errors.plannedCost = 'invalidAmount';
  }

  if (!isFiniteCurrencyValue(draft.actualCost)) {
    errors.actualCost = 'invalidAmount';
  }

  if (!isFiniteCurrencyValue(draft.depositPaid)) {
    errors.depositPaid = 'invalidAmount';
  }

  if (
    isFiniteCurrencyValue(draft.actualCost) &&
    isFiniteCurrencyValue(draft.depositPaid) &&
    draft.actualCost > 0 &&
    draft.depositPaid > draft.actualCost
  ) {
    errors.depositPaid = 'depositOverActual';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const parseCurrencyInput = (value: string): number => {
  const normalized = value.replace(/,/g, '').trim();
  if (!normalized) return 0;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? Math.max(parsed, 0) : Number.NaN;
};

export const formatBudgetAmount = (amount: number): string => {
  const rounded = Math.round(amount);
  return rounded.toLocaleString('en-US');
};

const isFiniteCurrencyValue = (value: number): boolean =>
  Number.isFinite(value) && value >= 0;

const sumBy = (items: BudgetItem[], getValue: (item: BudgetItem) => number): number =>
  items.reduce((total, item) => total + getValue(item), 0);
