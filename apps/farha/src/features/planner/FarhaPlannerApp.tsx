import React from 'react';

import { PlannerControllerProvider } from '../../core/planner/context/PlannerControllerContext';
import { usePhase1Planner } from '../../core/planner/usePhase1Planner';
import { AppWalkthroughGuide } from '../tips/components';
import { FarhaNavigator } from '../../navigation/FarhaNavigator';

export function FarhaPlannerApp() {
  const controller = usePhase1Planner();

  return (
    <PlannerControllerProvider controller={controller}>
      <FarhaNavigator controller={controller} />
      <AppWalkthroughGuide />
    </PlannerControllerProvider>
  );
}
