import React from 'react';
import { AppScreenTemplate } from '@dawwar/ui';
import { SplashContent } from './components/SplashContent';
import { useController } from './useController';

export function AuthSplashScreen() {
  const controller = useController();

  return (
    <AppScreenTemplate
      backgroundColor={controller.colors.primary}
      statusBarBackgroundColor={controller.colors.primary}
      statusBarStyle="light-content"
      edges={['top', 'bottom']}
    >
      <SplashContent
        colors={controller.colors}
        brand={controller.text.brand}
        version={controller.text.version}
        tagline={controller.text.tagline}
        {...controller.animation}
      />
    </AppScreenTemplate>
  );
}

export const JS_SplashScreen = AuthSplashScreen;
