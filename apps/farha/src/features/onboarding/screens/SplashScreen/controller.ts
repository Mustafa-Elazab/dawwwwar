import { usePlannerController } from '../../../planner/context/PlannerControllerContext';

export function useController() {
  const appController = usePlannerController();

  return {
    status: appController.status,
  };
}
