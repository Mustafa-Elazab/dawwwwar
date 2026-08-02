import type { Phase1PlannerController } from '../../planner/hooks/usePhase1Planner';

const benefits = ['unlimitedEvents', 'templates', 'noAds'] as const;

export function useController(appController: Phase1PlannerController) {
  return {
    benefits,
    upgradeToPro: appController.upgradeToPro,
    restorePurchase: appController.restorePurchase,
  };
}
