import { useCallback, useMemo } from 'react';

import { usePlannerController } from '../../../../core/planner/context/PlannerControllerContext';
import { calculateBudgetTotals } from '../../../../core/planner/domain/phase1Logic';

export function useController() {
  const appController = usePlannerController();
  const events = useMemo(
    () =>
      appController.state.occasions.map((event) => ({
        event,
        totals: calculateBudgetTotals(appController.getEventBudgetItems(event.id)),
      })),
    [appController],
  );
  const addEvent = useCallback(() => {
    if (!appController.state.isPro && appController.state.occasions.length >= 1) {
      appController.navigate('ProUpgradeScreen', { from: 'OccasionListScreen' });
      return;
    }

    appController.navigate('OccasionCreateScreen');
  }, [appController]);

  return {
    events,
    addEvent,
    openEvent: appController.openEvent,
  };
}
