import React, { createContext, useContext } from 'react';

import type { Phase1PlannerController } from '../hooks/usePhase1Planner';

const PlannerControllerContext = createContext<Phase1PlannerController | undefined>(undefined);

interface PlannerControllerProviderProps {
  controller: Phase1PlannerController;
  children: React.ReactNode;
}

export function PlannerControllerProvider({
  controller,
  children,
}: PlannerControllerProviderProps) {
  return (
    <PlannerControllerContext.Provider value={controller}>
      {children}
    </PlannerControllerContext.Provider>
  );
}

export function usePlannerController() {
  const controller = useContext(PlannerControllerContext);

  if (!controller) {
    throw new Error('usePlannerController must be used inside PlannerControllerProvider');
  }

  return controller;
}
