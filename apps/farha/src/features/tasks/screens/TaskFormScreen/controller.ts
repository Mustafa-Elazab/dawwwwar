import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from '@dawwar/i18n';

import {
  calculateTaskBalance,
  parseCurrencyInput,
  validateTaskDraft,
} from '../../../../core/planner/domain/phase1Logic';
import type {
  FarhaPhase1Task,
  FarhaPhase1TaskCategoryKey,
  TaskStatus,
} from '../../../../core/planner/domain/phase1Types';
import { usePlannerController } from '../../../../core/planner/context/PlannerControllerContext';
import { confirmAction, getScreenEvent } from '../../../planner/utils/helpers';

interface TaskFormState {
  title: string;
  category?: FarhaPhase1TaskCategoryKey;
  dueDate: string;
  notes: string;
  status: TaskStatus;
  hasCost: boolean;
  plannedCost: string;
  actualCost: string;
  depositPaid: string;
  hasPaymentPlan: boolean;
  monthlyAmount: string;
  nextDueDate: string;
}

const defaultForm: TaskFormState = {
  title: '',
  dueDate: '',
  notes: '',
  status: 'pending',
  hasCost: false,
  plannedCost: '',
  actualCost: '',
  depositPaid: '',
  hasPaymentPlan: false,
  monthlyAmount: '',
  nextDueDate: '',
};

export function useController() {
  const appController = usePlannerController();
  const { t } = useTranslation();
  const event = getScreenEvent(appController);
  const taskId = appController.route.params?.taskId ??
    appController.route.params?.budgetItemId ??
    appController.route.params?.checklistItemId;
  const editingTask = appController.getTaskById(taskId);
  const [form, setForm] = useState<TaskFormState>(() => taskToForm(editingTask));
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => setForm(taskToForm(editingTask)), [editingTask]);

  const draft = useMemo(() => {
    const plannedCost = form.hasCost ? parseCurrencyInput(form.plannedCost) : undefined;
    const actualCost = form.hasCost ? parseCurrencyInput(form.actualCost) : undefined;
    const depositPaid = form.hasCost ? parseCurrencyInput(form.depositPaid) ?? 0 : 0;
    const monthlyAmount = form.hasCost && form.hasPaymentPlan
      ? parseCurrencyInput(form.monthlyAmount)
      : undefined;

    return {
      id: editingTask?.id,
      occasionId: event?.id ?? '',
      title: form.title,
      category: form.category,
      dueDate: form.dueDate || undefined,
      notes: form.notes || undefined,
      status: form.status,
      plannedCost,
      actualCost,
      depositPaid,
      paymentPlan: monthlyAmount
        ? {
            monthlyAmount,
            nextDueDate: form.nextDueDate || form.dueDate || new Date().toISOString().slice(0, 10),
          }
        : undefined,
    };
  }, [editingTask?.id, event?.id, form]);
  const validation = validateTaskDraft(draft);
  const balance = calculateTaskBalance({
    plannedCost: draft.plannedCost,
    actualCost: draft.actualCost,
    depositPaid: draft.depositPaid ?? 0,
  });

  const save = () => {
    setSubmitted(true);
    if (!event || !validation.isValid) return;
    appController.saveTask(draft);
  };

  const deleteTask = () => {
    if (!editingTask) return;
    confirmAction(
      t('farha.phase1.confirm.deleteTask'),
      () => appController.deleteTask(editingTask.id),
      t('farha.phase1.confirm.cancel'),
      t('farha.phase1.confirm.ok'),
    );
  };

  return {
    event,
    editingTask,
    form,
    submitted,
    validation,
    categories: appController.getEventCategories(event?.id),
    selectedCategoryId: form.category ? `${event?.id ?? ''}-${form.category}` : '',
    balance,
    setForm,
    save,
    deleteTask,
  };
}

const taskToForm = (task?: FarhaPhase1Task): TaskFormState => {
  if (!task) return defaultForm;
  const hasCost = typeof task.plannedCost === 'number' ||
    typeof task.actualCost === 'number' ||
    task.depositPaid > 0;

  return {
    title: task.titleKey ?? task.title,
    category: task.category,
    dueDate: task.dueDate ?? '',
    notes: task.notes ?? '',
    status: task.status,
    hasCost,
    plannedCost: task.plannedCost ? String(task.plannedCost) : '',
    actualCost: task.actualCost ? String(task.actualCost) : '',
    depositPaid: task.depositPaid ? String(task.depositPaid) : '',
    hasPaymentPlan: !!task.paymentPlan,
    monthlyAmount: task.paymentPlan ? String(task.paymentPlan.monthlyAmount) : '',
    nextDueDate: task.paymentPlan?.nextDueDate ?? task.dueDate ?? '',
  };
};
