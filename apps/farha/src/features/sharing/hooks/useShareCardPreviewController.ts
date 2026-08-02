import { useMemo } from 'react';

import {
  calculateBudgetTotals,
  createSharePayload,
  getChecklistSummary,
} from '../../planner/domain/phase1Logic';
import type { Phase1PlannerController } from '../../planner/hooks/usePhase1Planner';
import { getScreenEvent } from '../../planner/utils/helpers';

export function useController(appController: Phase1PlannerController) {
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
