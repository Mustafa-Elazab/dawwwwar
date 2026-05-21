export type OnboardingVisualType = 'icon' | 'illustration' | 'video' | 'lottie';

export type OnboardingTheme = 'light' | 'dark' | 'auto';

export interface OnboardingCta {
  labelKey: string;
  action: 'next' | 'skip' | 'finish';
}

export interface OnboardingSlide {
  id: string;
  titleKey: string;
  subtitleKey: string;
  visualType: OnboardingVisualType;
  visual?: {
    type: OnboardingVisualType;
    iconName?: string;
  };
  theme: OnboardingTheme;
  cta: OnboardingCta;
  analyticsId: string;
}

export interface OnboardingState {
  completed: boolean;
  version: number;
  completedAt?: number;
  skippedAt?: number;
}

export type OnboardingEventName =
  | 'onboarding_impression'
  | 'onboarding_skip'
  | 'onboarding_complete'
  | 'onboarding_cta_press'
  | 'onboarding_slide_change';

export interface OnboardingEvent {
  name: OnboardingEventName;
  slideId?: string;
  analyticsId?: string;
  timestamp: number;
}
