import { useMemo } from 'react';

import { usePlannerController } from '../../../../core/planner/context/PlannerControllerContext';
import { getChecklistSummary } from '../../../../core/planner/domain/phase1Logic';
import { getScreenEvent } from '../../../planner/utils/helpers';

export function useController() {
  const appController = usePlannerController();
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
    markDone: (checklistItemId: string) =>
      appController.setChecklistItemStatus(checklistItemId, 'done'),
  };
}
