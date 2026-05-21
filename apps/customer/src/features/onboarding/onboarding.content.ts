import type { OnboardingSlide } from './onboarding.types';

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: 'intentional_delivery',
    titleKey: 'onboarding.slide1.title',
    subtitleKey: 'onboarding.slide1.subtitle',
    visualType: 'icon',
    visual: { type: 'icon', iconName: 'moped' },
    theme: 'auto',
    cta: { labelKey: 'onboarding.cta.next', action: 'next' },
    analyticsId: 'onboarding_slide_1',
  },
  {
    id: 'trusted_merchants',
    titleKey: 'onboarding.slide2.title',
    subtitleKey: 'onboarding.slide2.subtitle',
    visualType: 'icon',
    visual: { type: 'icon', iconName: 'map-marker-path' },
    theme: 'auto',
    cta: { labelKey: 'onboarding.cta.next', action: 'next' },
    analyticsId: 'onboarding_slide_2',
  },
  {
    id: 'calm_experience',
    titleKey: 'onboarding.slide3.title',
    subtitleKey: 'onboarding.slide3.subtitle',
    visualType: 'icon',
    visual: { type: 'icon', iconName: 'wallet-outline' },
    theme: 'auto',
    cta: { labelKey: 'onboarding.getStarted', action: 'finish' },
    analyticsId: 'onboarding_slide_3',
  },
];
