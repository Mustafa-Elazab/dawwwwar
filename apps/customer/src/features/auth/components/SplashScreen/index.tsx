import React from 'react';
import { SplashScreenVisual, type SplashContent } from './SplashScreenVisual';
import { useSplashAnimation } from './useSplashAnimation';

export interface SplashScreenProps {
  isExiting?: boolean;
  content?: SplashContent;
}

export function JS_SplashScreen({ isExiting = false, content }: SplashScreenProps) {
  const animatedStyles = useSplashAnimation({ isExiting });

  return <SplashScreenVisual content={content} animatedStyles={animatedStyles} />;
}
