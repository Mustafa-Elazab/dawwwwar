import { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  useWindowDimensions,
} from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { storage, StorageKeys } from '../../../../core/storage/mmkv';
import { AUTH_ROUTES } from '../../../../navigation/routes';
import type { AuthStackParamList } from '../../../../navigation/types';

export interface OnboardingStep {
  icon: string;
  title: string;
  body: string;
}

const STEPS = [
  { icon: 'storefront-outline', title: 'onboarding.wide_title', body: 'onboarding.wide_body' },
  { icon: 'rocket-launch-outline', title: 'onboarding.fast_title', body: 'onboarding.fast_body' },
  { icon: 'map-marker-path', title: 'onboarding.track_title', body: 'onboarding.track_body' },
  { icon: 'ticket-percent-outline', title: 'onboarding.offer_title', body: 'onboarding.offer_body' },
] as const;

type Nav = StackNavigationProp<AuthStackParamList>;

export function useController() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const navigation = useNavigation<Nav>();
  const listRef = useRef<FlatList<OnboardingStep>>(null);
  const [index, setIndex] = useState(0);

  const steps = useMemo(
    () => STEPS.map((step) => ({
      icon: step.icon,
      title: t(step.title),
      body: t(step.body),
    })),
    [t],
  );

  const isLast = index === steps.length - 1;

  const goLogin = useCallback(() => {
    storage.set(StorageKeys.ONBOARDING_SEEN, true);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: AUTH_ROUTES.PHONE }],
      }),
    );
  }, [navigation]);

  const goNext = useCallback(() => {
    const nextIndex = Math.min(index + 1, steps.length - 1);
    listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    setIndex(nextIndex);
  }, [index, steps.length]);

  const handleMomentumEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
      setIndex(Math.min(Math.max(nextIndex, 0), steps.length - 1));
    },
    [steps.length, width],
  );

  return {
    colors,
    width,
    steps,
    index,
    isLast,
    listRef,
    labels: {
      next: t('onboarding.next'),
      login: t('onboarding.login'),
    },
    handlers: {
      goNext,
      goLogin,
      handleMomentumEnd,
    },
  };
}
