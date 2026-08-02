import { useMemo } from 'react';

import { getChecklistSummary } from '../../planner/domain/phase1Logic';
import type { Phase1PlannerController } from '../../planner/hooks/usePhase1Planner';
import { getScreenEvent } from '../../planner/utils/helpers';

export function useController(appController: Phase1PlannerController) {
  const event = getScreenEvent(appController);
  const items = useMemo(
    () => appController.getEventChecklistItems(event?.id),
    [appController, event?.id],
  );
  const summary = useMemo(() => getChecklistSummary(items), [items]);
  const currentStep = summary.doneCount >= summary.actionableTotal && summary.actionableTotal > 0
    ? 1
    : 0;

  return {
    event,
    items,
    summary,
    currentStep,
    addTask: () => event && appController.navigate('ChecklistItemEditScreen', { eventId: event.id }),
    editTask: (checklistItemId: string) =>
      event && appController.navigate('ChecklistItemEditScreen', {
        eventId: event.id,
        checklistItemId,
      }),
  };
}
