import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTranslation } from '@dawwar/i18n';
import { AnimatedPressable, Button, Text } from '@dawwar/ui';
import { easings, motion, space, typography, useTheme, microInteractions } from '@dawwar/theme';
import { onboardingSlides } from '../../onboarding.content';
import {
  completeOnboarding,
  getOnboardingSnapshot,
  skipOnboarding,
  trackOnboardingEvent,
} from '../../onboarding.service';
import { OnboardingPagination } from '../../components/OnboardingPagination';
import { OnboardingSlideView } from '../../components/OnboardingSlideView';
import type { RootParamList } from '../../../../navigation/types';
import type { NavigationProp } from '@react-navigation/native';

export function OnboardingScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { width } = useWindowDimensions();
  const navigation = useNavigation<NavigationProp<RootParamList>>();

  const listRef = useRef<Animated.FlatList<any>>(null);
  const scrollX = useSharedValue(0);
  const ctaProgress = useSharedValue(0);
  const screenOpacity = useSharedValue(0);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    screenOpacity.value = withTiming(1, {
      duration: motion.onboardingEnterMs,
      easing: easings.standard,
    });
  }, [screenOpacity]);

  useEffect(() => {
    ctaProgress.value = 0;
    ctaProgress.value = withTiming(1, {
      duration: motion.onboardingCtaMs,
      easing: easings.standard,
    });
  }, [activeIndex, ctaProgress]);

  useEffect(() => {
    const slide = onboardingSlides[0];
    trackOnboardingEvent({
      name: 'onboarding_impression',
      analyticsId: slide.analyticsId,
      slideId: slide.id,
    });
  }, []);

  useEffect(() => {
    const snapshot = getOnboardingSnapshot();
    if (snapshot.completed) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Auth' }],
        }),
      );
    }
  }, [navigation]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const screenStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  const ctaStyle = useAnimatedStyle(() => ({
    opacity: ctaProgress.value,
    transform: [{ translateY: (1 - ctaProgress.value) * 10 }],
  }));

  const resetToAuth = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      }),
    );
  };

  const finalizeOnboarding = (mode: 'skip' | 'finish') => {
    if (mode === 'skip') {
      skipOnboarding();
    } else {
      completeOnboarding();
    }
    resetToAuth();
  };

  const handleSkip = () => {
    finalizeOnboarding('skip');
  };

  const handleCta = () => {
    const slide = onboardingSlides[activeIndex];
    trackOnboardingEvent({
      name: 'onboarding_cta_press',
      analyticsId: slide.analyticsId,
      slideId: slide.id,
    });

    if (slide.cta.action === 'next') {
      const nextIndex = Math.min(activeIndex + 1, onboardingSlides.length - 1);
      listRef.current?.scrollToOffset({ offset: nextIndex * width, animated: true });
      return;
    }

    if (slide.cta.action === 'finish') {
      finalizeOnboarding('finish');
    } else if (slide.cta.action === 'skip') {
      finalizeOnboarding('skip');
    }
  };

  const handleSlideChange = (index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
    const slide = onboardingSlides[index];
    trackOnboardingEvent({
      name: 'onboarding_slide_change',
      analyticsId: slide.analyticsId,
      slideId: slide.id,
    });
    trackOnboardingEvent({
      name: 'onboarding_impression',
      analyticsId: slide.analyticsId,
      slideId: slide.id,
    });
  };

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 55 }).current;
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      const nextIndex = viewableItems?.[0]?.index ?? 0;
      handleSlideChange(nextIndex);
    },
  ).current;

  const activeSlide = onboardingSlides[activeIndex];
  const ctaLabel =
    activeIndex === onboardingSlides.length - 1
      ? t('onboarding.getStarted')
      : t(activeSlide.cta.labelKey);

  return (
    <Animated.View style={[styles.container, screenStyle]}>
      <View style={styles.header}>
        <AnimatedPressable
          onPress={handleSkip}
          pressScale={microInteractions.pressScale}
          pressOpacity={microInteractions.pressOpacity}
          pressTranslateY={1}
        >
          <Text style={styles.skip}>{t('onboarding.cta.skip')}</Text>
        </AnimatedPressable>
      </View>

      <View style={styles.visualArea}>
        <Animated.FlatList
          ref={listRef}
          data={onboardingSlides}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <OnboardingSlideView slide={item} progress={scrollX} index={index} width={width} />
          )}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          snapToInterval={width}
          decelerationRate="fast"
        />
      </View>

      <View style={styles.footerCard}>
        <Text style={styles.title}>{t(activeSlide.titleKey)}</Text>
        <Text style={styles.subtitle}>{t(activeSlide.subtitleKey)}</Text>

        <OnboardingPagination count={onboardingSlides.length} progress={scrollX} width={width} />

        <Animated.View style={ctaStyle}>
          <Button label={ctaLabel} onPress={handleCta} fullWidth style={styles.ctaBtn} />
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const createStyles = (colors: {
  background: string;
  text: string;
  textSecondary: string;
  borderLight: string;
  primary: string;
  surface: string;
}) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#0D0D0D',
    },
    header: {
      position: 'absolute',
      top: space['2xl'],
      end: space.xl,
      zIndex: 10,
      alignItems: 'flex-end',
    },
    skip: {
      ...typography.label,
      color: '#A0A0A0',
      fontSize: 13,
    },
    visualArea: {
      height: '55%',
    },
    footerCard: {
      flex: 1,
      backgroundColor: '#1A1A1A',
      borderTopStartRadius: 32,
      borderTopEndRadius: 32,
      paddingHorizontal: 32,
      paddingTop: 32,
      paddingBottom: space.xl,
      gap: space.lg,
    },
    title: {
      ...typography.h2,
      color: '#F5F5F5',
      fontSize: 28,
      lineHeight: 34,
      fontWeight: '700',
      textAlign: 'auto',
    },
    subtitle: {
      ...typography.body2,
      color: '#A0A0A0',
      fontSize: 15,
      lineHeight: 22,
      textAlign: 'auto',
    },
    ctaBtn: {
      borderRadius: 16,
    },
  });
