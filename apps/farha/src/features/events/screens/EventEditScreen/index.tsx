import React from 'react';
import { useTranslation } from '@dawwar/i18n';
import { AppButton } from '@dawwar/ui';

import { EventForm } from '../../components';
import { MissingEvent, ScreenFrame } from '../../../planner/components';
import { useController } from './controller';

export function EventEditScreen() {
  const { t } = useTranslation();
  const ctrl = useController();

  if (!ctrl.event) return <MissingEvent />;

  return (
    <ScreenFrame title={t('farha.phase1.eventEdit.title')} showBack>
      <EventForm form={ctrl.form} submitted={ctrl.submitted} onChange={ctrl.setForm} />
      <AppButton
        label={t('farha.phase1.actions.save')}
        onPress={ctrl.save}
        fullWidth
      />
      <AppButton
        label={t('farha.phase1.actions.deleteEvent')}
        variant="danger"
        onPress={ctrl.deleteEvent}
        fullWidth
      />
    </ScreenFrame>
  );
}
