import { usePlannerController } from '../../../../core/planner/context/PlannerControllerContext';

export function useController() {
  const appController = usePlannerController();

  return {
    status: appController.status,
  };
}
