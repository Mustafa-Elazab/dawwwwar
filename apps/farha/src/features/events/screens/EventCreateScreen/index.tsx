import React from 'react';
import { useTranslation } from '@dawwar/i18n';
import { AppButton } from '@dawwar/ui';

import { EventForm } from '../../components';
import { ScreenFrame } from '../../../planner/components';
import { useController } from './controller';

export function EventCreateScreen() {
  const { t } = useTranslation();
  const ctrl = useController();

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
