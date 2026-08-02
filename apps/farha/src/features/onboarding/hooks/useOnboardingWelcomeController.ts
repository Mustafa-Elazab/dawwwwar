import type { Phase1PlannerController } from '../../planner/hooks/usePhase1Planner';

const onboardingSlides = ['budget', 'checklist', 'share'] as const;

export function useController(appController: Phase1PlannerController) {
  return {
    slides: onboardingSlides,
    completeOnboarding: appController.completeOnboarding,
  };
}
