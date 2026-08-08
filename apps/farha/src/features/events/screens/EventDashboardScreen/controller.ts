import { useMemo } from 'react';

import {
  calculateBudgetTotals,
  getTaskSummary,
} from '../../../../core/planner/domain/phase1Logic';
import { usePlannerController } from '../../../../core/planner/context/PlannerControllerContext';
import { getScreenEvent } from '../../../planner/utils/helpers';

export function useController() {
  const appController = usePlannerController();
  const event = getScreenEvent(appController);
  const tasks = useMemo(
    () => appController.getEventTasks(event?.id),
    [appController, event?.id],
  );
  const budgetTotals = useMemo(() => calculateBudgetTotals(tasks), [tasks]);
  const savingsSummary = useMemo(
    () => appController.getSavingsSummary(event?.id),
    [appController, event?.id],
  );
  const taskSummary = useMemo(() => getTaskSummary(tasks), [tasks]);

  return {
    event,
    budgetTotals,
    savingsSummary,
    checklistSummary: taskSummary,
    taskSummary,
    isPro: appController.state.isPro,
    editEvent: () => event && appController.navigate('OccasionEditScreen', { occasionId: event.id }),
    switchEvent: () => appController.navigate('OccasionListScreen'),
    openTasks: () => appController.openTab('tasks'),
    shareResults: () => appController.openTab('share'),
  };
}
