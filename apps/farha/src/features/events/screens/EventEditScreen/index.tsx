import React, { useRef } from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { AppButton, AppScreenTemplate } from '@dawwar/ui';

import { EventForm } from '../../components';
import { usePlannerScreenChrome } from '../../../planner/hooks/usePlannerScreenChrome';
import { MissingEventState } from '../../../planner/states/MissingEventState';
import { useController } from './controller';

export function EventEditScreen() {
  const { t } = useTranslation();
  const scrollRef = useRef<ScrollView>(null);
  const ctrl = useController();
  const screen = usePlannerScreenChrome({
    title: t('farha.phase1.eventEdit.title'),
    showBack: true,
  });

  if (!ctrl.event) return <MissingEventState />;

  return (
    <AppScreenTemplate {...screen.templateProps}>
      <ScrollView ref={scrollRef} {...screen.scrollViewProps}>
        <EventForm
          form={ctrl.form}
          submitted={ctrl.submitted}
          onChange={ctrl.setForm}
          scrollRef={scrollRef}
          photoError={ctrl.photoErrorKey ? t(ctrl.photoErrorKey) : undefined}
          onPickCoverPhoto={ctrl.pickCoverPhoto}
          onRemoveCoverPhoto={ctrl.removeCoverPhoto}
        />
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
