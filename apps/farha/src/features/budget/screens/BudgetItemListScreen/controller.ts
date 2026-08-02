import { useMemo } from 'react';

import { usePlannerController } from '../../../planner/context/PlannerControllerContext';

export function useController() {
  const appController = usePlannerController();
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
