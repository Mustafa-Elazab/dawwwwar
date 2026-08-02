import type { Phase1PlannerController } from '../hooks/usePhase1Planner';

export interface Phase1ScreenProps {
  controller: Phase1PlannerController;
}

export type Phase1TranslationFn = (
  key: string,
  options?: Record<string, unknown>,
) => string;
