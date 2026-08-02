import React from 'react';
import { useTranslation } from '@dawwar/i18n';
import { AppButton } from '@dawwar/ui';

import { usePlannerController } from '../context/PlannerControllerContext';
import { ScreenFrame } from './ScreenFrame';

export function MissingEvent() {
  const { t } = useTranslation();
  const controller = usePlannerController();

  return (
    <ScreenFrame title={t('farha.phase1.errors.missingEvent')} showBack>
      <AppButton
        label={t('farha.phase1.actions.createEvent')}
        onPress={() => controller.navigate('EventCreateScreen')}
        fullWidth
      />
    </ScreenFrame>
  );
}
