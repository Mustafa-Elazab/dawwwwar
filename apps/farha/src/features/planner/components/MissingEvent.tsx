import React from 'react';
import { useTranslation } from '@dawwar/i18n';
import { AppButton } from '@dawwar/ui';

import type { Phase1ScreenProps } from '../types/screenTypes';
import { ScreenFrame } from './ScreenFrame';

export function MissingEvent({ controller }: Phase1ScreenProps) {
  const { t } = useTranslation();

  return (
    <ScreenFrame title={t('farha.phase1.errors.missingEvent')} controller={controller} showBack>
      <AppButton
        label={t('farha.phase1.actions.createEvent')}
        onPress={() => controller.navigate('EventCreateScreen')}
        fullWidth
      />
    </ScreenFrame>
  );
}
