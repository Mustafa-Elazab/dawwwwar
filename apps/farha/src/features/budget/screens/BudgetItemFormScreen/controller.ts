import { useEffect, useState } from 'react';
import { useTranslation } from '@dawwar/i18n';

import {
  parseCurrencyInput,
  validateBudgetItemDraft,
} from '../../../planner/domain/phase1Logic';
import { usePlannerController } from '../../../planner/context/PlannerControllerContext';
import type {
  BudgetItemDraft,
  FarhaPhase1BudgetCategory,
  FarhaPhase1BudgetItem,
} from '../../../planner/domain/phase1Types';
import { confirmAction } from '../../../planner/utils/helpers';

interface BudgetItemFormState {
  categoryId: string;
  name: string;
  plannedCost: string;
  actualCost: string;
  depositPaid: string;
  dueDate: string;
  notes: string;
}

const emptyBudgetItemForm: BudgetItemFormState = {
  categoryId: '',
  name: '',
  plannedCost: '',
  actualCost: '',
  depositPaid: '',
  dueDate: '',
  notes: '',
};

export function useController() {
  const appController = usePlannerController();
  const { t } = useTranslation();
  const category = appController.getCategoryById(appController.route.params?.categoryId);
  const editingItem = appController.getBudgetItemById(appController.route.params?.budgetItemId);
  const [form, setForm] = useState<BudgetItemFormState>(
    budgetItemToForm(editingItem, category),
  );
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setForm(budgetItemToForm(editingItem, category));
  }, [category, editingItem]);

  const draft = formToBudgetDraft(form, editingItem?.id, category?.id ?? '');
  const validation = validateBudgetItemDraft(draft);
  const balance = (draft.actualCost ?? draft.plannedCost) - draft.depositPaid;

  const save = () => {
    setSubmitted(true);
    if (!category || !validation.isValid) return;
    appController.saveBudgetItem(draft);
  };

  const deleteItem = () => {
    if (!editingItem) return;

    confirmAction(
      t('farha.phase1.confirm.deleteItem'),
      () => appController.deleteBudgetItem(editingItem.id),
      t('farha.phase1.confirm.cancel'),
      t('farha.phase1.confirm.ok'),
    );
  };

  return {
    category,
    editingItem,
    form,
    submitted,
    validation,
    balance,
    setForm,
    save,
    deleteItem,
  };
}

function budgetItemToForm(
  item?: FarhaPhase1BudgetItem,
  category?: FarhaPhase1BudgetCategory,
): BudgetItemFormState {
  if (!item) {
    return { ...emptyBudgetItemForm, categoryId: category?.id ?? '' };
  }

  return {
    categoryId: item.categoryId,
    name: item.name,
    plannedCost: item.plannedCost ? String(item.plannedCost) : '',
    actualCost: typeof item.actualCost === 'number' ? String(item.actualCost) : '',
    depositPaid: item.depositPaid ? String(item.depositPaid) : '',
    dueDate: item.dueDate ?? '',
    notes: item.notes ?? '',
  };
}

function formToBudgetDraft(
  form: BudgetItemFormState,
  id: string | undefined,
  categoryId: string,
): BudgetItemDraft {
  return {
    id,
    categoryId,
    name: form.name,
    plannedCost: parseCurrencyInput(form.plannedCost) ?? Number.NaN,
    actualCost: parseCurrencyInput(form.actualCost),
    depositPaid: parseCurrencyInput(form.depositPaid) ?? 0,
    dueDate: form.dueDate,
    notes: form.notes,
  };
}
