import React from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { AppButton, AppScreenTemplate } from '@dawwar/ui';

import { EventForm } from '../../components';
import { usePlannerScreenChrome } from '../../../planner/hooks/usePlannerScreenChrome';
import { useController } from './controller';

export function EventCreateScreen() {
  const { t } = useTranslation();
  const ctrl = useController();
  const screen = usePlannerScreenChrome({
    title: t('farha.phase1.eventCreate.title'),
    subtitle: t('farha.phase1.eventCreate.subtitle'),
    showBack: true,
  });

  return (
    <AppScreenTemplate {...screen.templateProps}>
      <ScrollView {...screen.scrollViewProps}>
        <EventForm
          form={ctrl.form}
          submitted={ctrl.submitted}
          onChange={ctrl.setForm}
        />
        <AppButton label={t('farha.phase1.actions.createEvent')} onPress={ctrl.submit} fullWidth />
      </ScrollView>
    </AppScreenTemplate>
  );
}
