import { useCallback, useMemo } from 'react';

import { usePlannerController } from '../../../../core/planner/context/PlannerControllerContext';
import { calculateBudgetTotals } from '../../../../core/planner/domain/phase1Logic';

export function useController() {
  const appController = usePlannerController();
  const events = useMemo(
    () =>
      appController.state.events.map((event) => ({
        event,
        totals: calculateBudgetTotals(appController.getEventBudgetItems(event.id)),
      })),
    [appController],
  );
  const addEvent = useCallback(() => {
    if (!appController.state.isPro && appController.state.events.length >= 1) {
      appController.navigate('ProUpgradeScreen', { from: 'EventListScreen' });
      return;
    }

    appController.navigate('EventCreateScreen');
  }, [appController]);

  return {
    events,
    addEvent,
    openEvent: appController.openEvent,
  };
}
