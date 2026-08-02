import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  StatusBar,
  View,
} from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { AppText } from '@dawwar/ui';

import { useController } from './controller';
import { createStyles } from './styles';
import splashBackground from '../../../../assets/images/farha_splash_background.png';
import farhaLogo from '../../../../assets/images/farha_logo.png';

export function SplashScreen() {
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles(), []);
  const ctrl = useController();
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [pulse]);

  const ringScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.88, 1.12],
  });
  const ringOpacity = pulse.interpolate({
    inputRange: [0, 0.55, 1],
    outputRange: [0.38, 0.16, 0.3],
  });
  const textScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.035],
  });

  return (
    <ImageBackground source={splashBackground} resizeMode="cover" style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={styles.content}>
        <View style={styles.logoWrap}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.ringHalo,
              {
                opacity: ringOpacity,
                transform: [{ scale: ringScale }],
              },
            ]}
          />
          <Image source={farhaLogo} resizeMode="contain" style={styles.logo} />
        </View>
        <View style={styles.copy}>
          <AppText variant="h1" align="center" color="#FFF8EC" style={styles.brand}>
            {t('farha.phase1.brand')}
          </AppText>
          <AppText variant="body1" align="center" color="#FFE9C7" style={styles.subtitle}>
            {t('farha.phase1.splash.subtitle')}
          </AppText>
          <Animated.View style={[styles.warmTextPill, { transform: [{ scale: textScale }] }]}>
            <AppText variant="label" align="center" color="#FFF8EC" style={styles.warmText}>
              {t('farha.phase1.splash.warmText')}
            </AppText>
          </Animated.View>
          {ctrl.status === 'loading' ? (
            <View style={styles.loadingDots} accessibilityLabel={t('farha.phase1.splash.subtitle')}>
              <View style={styles.dot} />
              <View style={[styles.dot, styles.dotMuted]} />
              <View style={styles.dot} />
            </View>
          ) : null}
        </View>
      </View>
    </ImageBackground>
  );
}
