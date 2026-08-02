import React from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { AppButton, AppScreenTemplate } from '@dawwar/ui';

import { EventForm } from '../../components';
import { usePlannerScreenChrome } from '../../../planner/hooks/usePlannerScreenChrome';
import { MissingEventState } from '../../../planner/states/MissingEventState';
import { useController } from './controller';

export function EventEditScreen() {
  const { t } = useTranslation();
  const ctrl = useController();
  const screen = usePlannerScreenChrome({
    title: t('farha.phase1.eventEdit.title'),
    showBack: true,
  });

  if (!ctrl.event) return <MissingEventState />;

  return (
    <AppScreenTemplate {...screen.templateProps}>
      <ScrollView {...screen.scrollViewProps}>
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
      </ScrollView>
    </AppScreenTemplate>
  );
}
