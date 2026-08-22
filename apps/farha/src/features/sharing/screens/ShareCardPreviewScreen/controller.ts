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
  const totals = useMemo(
    () => calculateBudgetTotals(appController.getEventTasks(event?.id)),
    [appController, event?.id],
  );
  const summary = useMemo(
    () => getTaskSummary(appController.getEventTasks(event?.id)),
    [appController, event?.id],
  );
  return {
    event,
    totals,
    summary,
    share: appController.shareActiveEvent,
  };
}
