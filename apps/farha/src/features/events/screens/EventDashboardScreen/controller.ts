import { useMemo } from 'react';

import {
  calculateBudgetTotals,
  getChecklistSummary,
} from '../../../planner/domain/phase1Logic';
import { usePlannerController } from '../../../planner/context/PlannerControllerContext';
import { getScreenEvent } from '../../../planner/utils/helpers';

export function useController() {
  const appController = usePlannerController();
  const event = getScreenEvent(appController);
  const budgetItems = useMemo(
    () => appController.getEventBudgetItems(event?.id),
    [appController, event?.id],
  );
  const checklistItems = useMemo(
    () => appController.getEventChecklistItems(event?.id),
    [appController, event?.id],
  );
  const budgetTotals = useMemo(() => calculateBudgetTotals(budgetItems), [budgetItems]);
  const checklistSummary = useMemo(
    () => getChecklistSummary(checklistItems),
    [checklistItems],
  );

  return {
    event,
    budgetTotals,
    checklistSummary,
    isPro: appController.state.isPro,
    editEvent: () => event && appController.navigate('EventEditScreen', { eventId: event.id }),
    switchEvent: () => appController.navigate('EventListScreen'),
    openBudget: () => appController.openTab('budget'),
    openChecklist: () => appController.openTab('checklist'),
    shareResults: () => event && appController.navigate('ShareCardPreviewScreen', { eventId: event.id }),
  };
}
