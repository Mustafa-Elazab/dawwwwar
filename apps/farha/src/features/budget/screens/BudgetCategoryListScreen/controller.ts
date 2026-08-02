import { useMemo, useState } from 'react';
import { useTranslation } from '@dawwar/i18n';

import {
  calculateBudgetTotals,
  validateBudgetCategoryDraft,
} from '../../../../core/planner/domain/phase1Logic';
import { usePlannerController } from '../../../../core/planner/context/PlannerControllerContext';
import type { FarhaPhase1BudgetCategory } from '../../../../core/planner/domain/phase1Types';
import {
  confirmAction,
  getScreenEvent,
} from '../../../planner/utils/helpers';

interface BudgetCategoryRowModel {
  category: FarhaPhase1BudgetCategory;
  itemCount: number;
  totals: ReturnType<typeof calculateBudgetTotals>;
}

export function useController() {
  const appController = usePlannerController();
  const { t } = useTranslation();
  const event = getScreenEvent(appController);
  const [categoryName, setCategoryName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const validation = validateBudgetCategoryDraft({
    eventId: event?.id ?? '',
    name: categoryName,
  });
  const totals = useMemo(
    () => calculateBudgetTotals(appController.getEventBudgetItems(event?.id)),
    [appController, event?.id],
  );
  const categories = useMemo<BudgetCategoryRowModel[]>(() => {
    if (!event) return [];

    return appController.getEventCategories(event.id).map((category) => {
      const items = appController.getCategoryItems(category.id);
      return {
        category,
        itemCount: items.length,
        totals: calculateBudgetTotals(items),
      };
    });
  }, [appController, event]);

  const addCategory = () => {
    setSubmitted(true);
    if (!event || !validation.isValid) return;

    appController.addBudgetCategory({ eventId: event.id, name: categoryName });
    setCategoryName('');
    setSubmitted(false);
  };

  const deleteCategory = (categoryId: string) => {
    confirmAction(
      t('farha.phase1.confirm.deleteCategory'),
      () => appController.deleteBudgetCategory(categoryId),
      t('farha.phase1.confirm.cancel'),
      t('farha.phase1.confirm.ok'),
    );
  };

  const openCategory = (categoryId: string) => {
    if (!event) return;
    appController.navigate('BudgetItemListScreen', { eventId: event.id, categoryId });
  };

  return {
    event,
    categoryName,
    submitted,
    validation,
    totals,
    categories,
    isPro: appController.state.isPro,
    setCategoryName,
    addCategory,
    deleteCategory,
    openCategory,
  };
}
