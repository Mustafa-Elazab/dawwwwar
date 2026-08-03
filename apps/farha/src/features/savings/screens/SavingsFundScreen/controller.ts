import { useMemo, useState } from 'react';

import { parseCurrencyInput } from '../../../../core/planner/domain/phase1Logic';
import { usePlannerController } from '../../../../core/planner/context/PlannerControllerContext';
import { getScreenEvent } from '../../../planner/utils/helpers';

export function useController() {
  const appController = usePlannerController();
  const event = getScreenEvent(appController);
  const summary = useMemo(
    () => appController.getSavingsSummary(event?.id),
    [appController, event?.id],
  );
  const contributions = useMemo(
    () => appController.getEventSavingsContributions(event?.id),
    [appController, event?.id],
  );
  const [goalInput, setGoalInput] = useState(
    typeof summary.monthlyGoal === 'number' ? String(summary.monthlyGoal) : '',
  );

  const saveGoal = () => {
    if (!event) return;

    const parsed = parseCurrencyInput(goalInput);
    appController.setSavingsMonthlyGoal(
      event.id,
      parsed && parsed > 0 ? parsed : undefined,
    );
  };

  return {
    event,
    summary,
    contributions,
    goalInput,
    setGoalInput,
    saveGoal,
    addContribution: () =>
      event && appController.navigate('SavingsContributionFormScreen', { eventId: event.id }),
    editContribution: (contributionId: string) =>
      event && appController.navigate('SavingsContributionFormScreen', {
        eventId: event.id,
        contributionId,
      }),
    allocateFunds: () =>
      event && summary.balance > 0 && appController.navigate('SavingsAllocationScreen', { eventId: event.id }),
  };
}
