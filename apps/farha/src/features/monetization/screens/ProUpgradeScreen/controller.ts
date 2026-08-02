import { usePlannerController } from '../../../planner/context/PlannerControllerContext';

const benefits = ['unlimitedEvents', 'templates', 'noAds'] as const;

export function useController() {
  const appController = usePlannerController();

  return {
    benefits,
    upgradeToPro: appController.upgradeToPro,
    restorePurchase: appController.restorePurchase,
  };
}
