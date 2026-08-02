import React from 'react';
import { useTranslation } from '@dawwar/i18n';
import { AppButton } from '@dawwar/ui';

import { EventForm } from '../../components';
import { ScreenFrame } from '../../../planner/components';
import type { Phase1ScreenProps } from '../../../planner/types/screenTypes';
import { useController } from '../../hooks/useEventCreateController';

export function EventCreateScreen({ controller }: Phase1ScreenProps) {
  const { t } = useTranslation();
  const ctrl = useController(controller);

  return (
    <ScreenFrame
      title={t('farha.phase1.eventCreate.title')}
      subtitle={t('farha.phase1.eventCreate.subtitle')}
    >
      <EventForm
        form={ctrl.form}
        submitted={ctrl.submitted}
        onChange={ctrl.setForm}
      />
      <AppButton label={t('farha.phase1.actions.createEvent')} onPress={ctrl.submit} fullWidth />
    </ScreenFrame>
  );
}
