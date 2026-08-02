import { usePlannerController } from '../../../planner/context/PlannerControllerContext';

const onboardingSlides = ['budget', 'checklist', 'share'] as const;

export function useController() {
  const appController = usePlannerController();

  return {
    slides: onboardingSlides,
    completeOnboarding: appController.completeOnboarding,
  };
}
