import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import {
  selectIsAuthenticated,
  selectIsLoading,
  logout,
  setUser,
} from '../../../../store/slices/auth.slice';
import { storage, StorageKeys } from '../../../../core/storage/mmkv';
import { authApi } from '../../core/api';
import { AUTH_ROUTES } from '../../../../navigation/routes';
import type { AuthStackParamList } from '../../../../navigation/types';
import logger from '../../../../utils/logger';

type SplashNavProp = StackNavigationProp<AuthStackParamList, typeof AUTH_ROUTES.SPLASH>;

const MIN_SPLASH_MS = 4200;

export function useController() {
  const navigation = useNavigation<SplashNavProp>();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const { t } = useTranslation();
  const { colors } = useTheme();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const versionOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.sequence([
        Animated.timing(titleOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.delay(350),
        Animated.timing(versionOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.delay(350),
        Animated.timing(taglineOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1400,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1400,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    });
  }, [fadeAnim, pulseAnim, scaleAnim, taglineOpacity, titleOpacity, versionOpacity]);

  useEffect(() => {
    let isMounted = true;
    const startedAt = Date.now();

    const runAfterMinimumSplash = (action: () => void) => {
      const remaining = Math.max(MIN_SPLASH_MS - (Date.now() - startedAt), 0);
      setTimeout(() => {
        if (isMounted) action();
      }, remaining);
    };

    const goToPhone = () => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: AUTH_ROUTES.PHONE }],
        }),
      );
    };

    const goToOnboarding = () => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: AUTH_ROUTES.ONBOARDING }],
        }),
      );
    };

    const restoreSession = async () => {
      const token = storage.getString(StorageKeys.ACCESS_TOKEN);
      const hasSeenOnboarding = storage.getBoolean(StorageKeys.ONBOARDING_SEEN);

      if (!token) {
        runAfterMinimumSplash(hasSeenOnboarding ? goToPhone : goToOnboarding);
        return;
      }

      try {
        const res = await authApi.getMe();
        const user =
          res && typeof res === 'object' && 'data' in res ? res.data : res;

        if (user) {
          runAfterMinimumSplash(() => dispatch(setUser(user)));
          return;
        }

        runAfterMinimumSplash(() => {
          dispatch(logout());
          goToPhone();
        });
      } catch (err) {
        logger.error('[SplashScreen] restoreSession error:', err);
        runAfterMinimumSplash(() => {
          storage.delete(StorageKeys.ACCESS_TOKEN);
          storage.delete(StorageKeys.REFRESH_TOKEN);
          dispatch(logout());
          goToPhone();
        });
      }
    };

    if (isAuthenticated) return undefined;

    if (!isLoading) {
      if (!storage.getBoolean(StorageKeys.ONBOARDING_SEEN)) {
        runAfterMinimumSplash(goToOnboarding);
      } else {
        runAfterMinimumSplash(goToPhone);
      }
      return undefined;
    }

    void restoreSession();

    return () => {
      isMounted = false;
    };
  }, [dispatch, isAuthenticated, isLoading, navigation]);

  return {
    colors,
    text: {
      brand: t('auth.splash_brand'),
      version: t('auth.splash_version', { version: '2.1.0' }),
      tagline: t('auth.splash_tagline'),
    },
    animation: {
      fadeAnim,
      scaleAnim,
      pulseAnim,
      titleOpacity,
      versionOpacity,
      taglineOpacity,
    },
  };
}
