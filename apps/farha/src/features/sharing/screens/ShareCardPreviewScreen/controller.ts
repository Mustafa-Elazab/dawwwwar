import { useMemo } from 'react';

import {
  calculateBudgetTotals,
  createSharePayload,
  getChecklistSummary,
} from '../../../../core/planner/domain/phase1Logic';
import { usePlannerController } from '../../../../core/planner/context/PlannerControllerContext';
import { getScreenEvent } from '../../../planner/utils/helpers';

export function useController() {
  const appController = usePlannerController();
  const event = getScreenEvent(appController);
  const totals = useMemo(
    () => calculateBudgetTotals(appController.getEventBudgetItems(event?.id)),
    [appController, event?.id],
  );
  const summary = useMemo(
    () => getChecklistSummary(appController.getEventChecklistItems(event?.id)),
    [appController, event?.id],
  );
  const sharePayload = useMemo(
    () => (event ? createSharePayload(appController.state, event.id) : ''),
    [appController.state, event],
  );

  return {
    event,
    totals,
    summary,
    sharePayload,
    share: appController.shareActiveEvent,
  };
}
