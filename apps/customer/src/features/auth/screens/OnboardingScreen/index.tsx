import React from 'react';
import { AppScreenTemplate } from '@dawwar/ui';
import { OnboardingContent } from './components/OnboardingContent';
import { useController } from './useController';

export function OnboardingScreen() {
  const controller = useController();

  return (
    <AppScreenTemplate>
      <OnboardingContent
        colors={controller.colors}
        width={controller.width}
        steps={controller.steps}
        index={controller.index}
        isLast={controller.isLast}
        listRef={controller.listRef}
        nextLabel={controller.labels.next}
        loginLabel={controller.labels.login}
        onNext={controller.handlers.goNext}
        onLogin={controller.handlers.goLogin}
        onMomentumEnd={controller.handlers.handleMomentumEnd}
      />
    </AppScreenTemplate>
  );
}
