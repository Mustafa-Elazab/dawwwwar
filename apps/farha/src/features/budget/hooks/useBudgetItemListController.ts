import { useMemo } from 'react';

import type { Phase1PlannerController } from '../../planner/hooks/usePhase1Planner';

export function useController(appController: Phase1PlannerController) {
  const category = appController.getCategoryById(appController.route.params?.categoryId);
  const items = useMemo(
    () => appController.getCategoryItems(category?.id),
    [appController, category?.id],
  );

  return {
    category,
    items,
    addItem: () => category && appController.navigate('BudgetItemFormScreen', { categoryId: category.id }),
    editItem: (budgetItemId: string) =>
      category && appController.navigate('BudgetItemFormScreen', {
        categoryId: category.id,
        budgetItemId,
      }),
  };
}
