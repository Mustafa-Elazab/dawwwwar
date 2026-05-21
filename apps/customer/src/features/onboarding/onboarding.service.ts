import { useEffect, useMemo, useState } from 'react';
import type { OnboardingEvent, OnboardingState } from './onboarding.types';
import {
  DEFAULT_ONBOARDING_VERSION,
  getOnboardingState,
  markOnboardingCompleted,
  markOnboardingSkipped,
  resetOnboarding,
} from './onboarding.storage';

let analyticsHandler: ((event: OnboardingEvent) => void) | null = null;
const stateListeners = new Set<(state: OnboardingState) => void>();

export const registerOnboardingAnalytics = (handler: (event: OnboardingEvent) => void) => {
  analyticsHandler = handler;
};

const emitEvent = (event: Omit<OnboardingEvent, 'timestamp'>) => {
  analyticsHandler?.({ ...event, timestamp: Date.now() });
};

const notifyStateChange = () => {
  const snapshot = getOnboardingState();
  stateListeners.forEach((listener) => listener(snapshot));
};

export const getOnboardingSnapshot = (): OnboardingState => getOnboardingState();

export const shouldShowOnboarding = (state: OnboardingState, version = DEFAULT_ONBOARDING_VERSION) =>
  !state.completed || state.version < version;

export const completeOnboarding = (version = DEFAULT_ONBOARDING_VERSION) => {
  markOnboardingCompleted(version);
  emitEvent({ name: 'onboarding_complete' });
  notifyStateChange();
};

export const skipOnboarding = (version = DEFAULT_ONBOARDING_VERSION) => {
  markOnboardingSkipped(version);
  emitEvent({ name: 'onboarding_skip' });
  notifyStateChange();
};

export const reopenOnboarding = () => {
  resetOnboarding();
  notifyStateChange();
};

export const trackOnboardingEvent = (event: Omit<OnboardingEvent, 'timestamp'>) => {
  emitEvent(event);
};

export const useOnboardingGate = () => {
  const [state, setState] = useState<OnboardingState>(() => getOnboardingState());
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    setState(getOnboardingState());
    setReady(true);
    const listener = (nextState: OnboardingState) => setState(nextState);
    stateListeners.add(listener);
    return () => {
      stateListeners.delete(listener);
    };
  }, []);

  const value = useMemo(
    () => ({
      isReady,
      state,
      shouldShow: shouldShowOnboarding(state),
    }),
    [isReady, state],
  );

  return value;
};
