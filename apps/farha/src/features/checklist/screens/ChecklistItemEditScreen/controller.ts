import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from '@dawwar/i18n';

import { usePlannerController } from '../../../../core/planner/context/PlannerControllerContext';
import { validateChecklistItemDraft } from '../../../../core/planner/domain/phase1Logic';
import type {
  ChecklistItemDraft,
  FarhaPhase1ChecklistItem,
} from '../../../../core/planner/domain/phase1Types';
import {
  confirmAction,
  getScreenEvent,
} from '../../../planner/utils/helpers';
import type { Phase1TranslationFn } from '../../../../core/planner/screenTypes';
import { getChecklistTitle } from '../../utils/checklistLabels';

interface ChecklistItemFormState {
  title: string;
  dueDate: string;
  categoryId: string;
  notes: string;
}

const emptyChecklistItemForm: ChecklistItemFormState = {
  title: '',
  dueDate: '',
  categoryId: '',
  notes: '',
};

export function useController() {
  const appController = usePlannerController();
  const { t } = useTranslation();
  const event = getScreenEvent(appController);
  const editingItem = appController.getChecklistItemById(appController.route.params?.checklistItemId);
  const categories = useMemo(
    () => appController.getEventCategories(event?.id),
    [appController, event?.id],
  );
  const [form, setForm] = useState<ChecklistItemFormState>(
    checklistItemToForm(editingItem, t),
  );
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setForm(checklistItemToForm(editingItem, t));
  }, [editingItem, t]);

  const draft: ChecklistItemDraft = {
    id: editingItem?.id,
    eventId: event?.id ?? '',
    title: form.title,
    dueDate: form.dueDate,
    categoryId: form.categoryId || undefined,
    notes: form.notes,
  };
  const validation = validateChecklistItemDraft(draft);

  const save = () => {
    setSubmitted(true);
    if (!event || !validation.isValid) return;
    appController.saveChecklistItem(draft);
  };

  const markDone = () => {
    if (editingItem) appController.setChecklistItemStatus(editingItem.id, 'done');
  };

  const markSkipped = () => {
    if (editingItem) appController.setChecklistItemStatus(editingItem.id, 'skipped');
  };

  const deleteTask = () => {
    if (!editingItem) return;

    confirmAction(
      t('farha.phase1.confirm.deleteTask'),
      () => appController.deleteChecklistItem(editingItem.id),
      t('farha.phase1.confirm.cancel'),
      t('farha.phase1.confirm.ok'),
    );
  };

  return {
    event,
    categories,
    editingItem,
    form,
    submitted,
    validation,
    setForm,
    save,
    markDone,
    markSkipped,
    deleteTask,
  };
}

function checklistItemToForm(
  item: FarhaPhase1ChecklistItem | undefined,
  t: Phase1TranslationFn,
): ChecklistItemFormState {
  if (!item) return emptyChecklistItemForm;

  return {
    title: getChecklistTitle(t, item),
    dueDate: item.dueDate ?? '',
    categoryId: item.categoryId ?? '',
    notes: item.notes ?? '',
  };
}
