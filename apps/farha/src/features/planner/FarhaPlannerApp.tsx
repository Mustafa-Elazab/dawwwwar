import React from 'react';

import { PlannerControllerProvider } from '../../core/planner/context/PlannerControllerContext';
import { usePhase1Planner } from '../../core/planner/usePhase1Planner';
import { AppWalkthroughGuide } from '../tips/components';
import { WalkthroughTargetProvider } from '../tips/components/WalkthroughTargetContext';
import { FarhaNavigator } from '../../navigation/FarhaNavigator';

export function FarhaPlannerApp() {
  const controller = usePhase1Planner();

  return (
    <PlannerControllerProvider controller={controller}>
      <WalkthroughTargetProvider>
        <FarhaNavigator controller={controller} />
        <AppWalkthroughGuide />
      </WalkthroughTargetProvider>
    </PlannerControllerProvider>
  );
}
