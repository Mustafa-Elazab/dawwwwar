import type { Phase1PlannerController } from '../../planner/hooks/usePhase1Planner';

export function useController(appController: Phase1PlannerController) {
  return {
    status: appController.status,
  };
}
