import React from 'react';
import { useTranslation } from '@dawwar/i18n';
import { AppButton } from '@dawwar/ui';

import { EventForm } from '../../components';
import { MissingEvent, ScreenFrame } from '../../../planner/components';
import type { Phase1ScreenProps } from '../../../planner/types/screenTypes';
import { useController } from '../../hooks/useEventEditController';

export function EventEditScreen({ controller }: Phase1ScreenProps) {
  const { t } = useTranslation();
  const ctrl = useController(controller);

  if (!ctrl.event) return <MissingEvent controller={controller} />;

  return (
    <ScreenFrame title={t('farha.phase1.eventEdit.title')} controller={controller} showBack>
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
