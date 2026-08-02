import { useCallback } from 'react';

import type { Phase1PlannerController } from '../../planner/hooks/usePhase1Planner';

export function useController(appController: Phase1PlannerController) {
  const addEvent = useCallback(() => {
    if (!appController.state.isPro && appController.state.events.length >= 1) {
      appController.navigate('ProUpgradeScreen', { from: 'EventListScreen' });
      return;
    }

    appController.navigate('EventCreateScreen');
  }, [appController]);

  return {
    events: appController.state.events,
    addEvent,
    openEvent: appController.openEvent,
  };
}
