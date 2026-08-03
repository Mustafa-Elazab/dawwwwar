import { useMemo } from 'react';

import {
  calculateBudgetTotals,
  getChecklistSummary,
} from '../../../../core/planner/domain/phase1Logic';
import { usePlannerController } from '../../../../core/planner/context/PlannerControllerContext';
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
  const savingsSummary = useMemo(
    () => appController.getSavingsSummary(event?.id),
    [appController, event?.id],
  );
  const checklistSummary = useMemo(
    () => getChecklistSummary(checklistItems),
    [checklistItems],
  );

  return {
    event,
    budgetTotals,
    savingsSummary,
    checklistSummary,
    isPro: appController.state.isPro,
    editEvent: () => event && appController.navigate('EventEditScreen', { eventId: event.id }),
    switchEvent: () => appController.navigate('EventListScreen'),
    openBudget: () => appController.openTab('budget'),
    openSavings: () => event && appController.navigate('SavingsFundScreen', { eventId: event.id }),
    openChecklist: () => appController.openTab('checklist'),
    shareResults: () => event && appController.navigate('ShareCardPreviewScreen', { eventId: event.id }),
  };
}
