import { storage, StorageKeys } from '../../core/storage/mmkv';
import type { OnboardingState } from './onboarding.types';

export const DEFAULT_ONBOARDING_VERSION = 1;

export const getOnboardingState = (): OnboardingState => {
  const completed = storage.getBoolean(StorageKeys.ONBOARDING_COMPLETED) ?? false;
  const version = storage.getNumber(StorageKeys.ONBOARDING_VERSION) ?? DEFAULT_ONBOARDING_VERSION;
  const completedAt = storage.getNumber(`${StorageKeys.ONBOARDING_COMPLETED}_at`) ?? undefined;
  const skippedAt =
    storage.getNumber(`${StorageKeys.ONBOARDING_COMPLETED}_skipped_at`) ?? undefined;

  return {
    completed,
    version,
    completedAt,
    skippedAt,
  };
};

export const setOnboardingState = (state: OnboardingState) => {
  storage.set(StorageKeys.ONBOARDING_COMPLETED, state.completed);
  storage.set(StorageKeys.ONBOARDING_VERSION, state.version);
  if (state.completedAt) storage.set(`${StorageKeys.ONBOARDING_COMPLETED}_at`, state.completedAt);
  if (state.skippedAt)
    storage.set(`${StorageKeys.ONBOARDING_COMPLETED}_skipped_at`, state.skippedAt);
};

export const markOnboardingCompleted = (version: number) => {
  const now = Date.now();
  setOnboardingState({ completed: true, version, completedAt: now });
};

export const markOnboardingSkipped = (version: number) => {
  const now = Date.now();
  setOnboardingState({ completed: true, version, skippedAt: now });
};

export const resetOnboarding = () => {
  setOnboardingState({ completed: false, version: DEFAULT_ONBOARDING_VERSION });
};
