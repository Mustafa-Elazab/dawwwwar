import React from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { AppButton, AppScreenTemplate } from '@dawwar/ui';

import { usePlannerController } from '../../../core/planner/context/PlannerControllerContext';
import { usePlannerScreenChrome } from '../hooks/usePlannerScreenChrome';

export function MissingEventState() {
  const { t } = useTranslation();
  const controller = usePlannerController();
  const screen = usePlannerScreenChrome({
    title: t('farha.phase1.errors.missingEvent'),
    showBack: true,
  });

  return (
    <AppScreenTemplate {...screen.templateProps}>
      <ScrollView {...screen.scrollViewProps}>
        <AppButton
          label={t('farha.phase1.actions.createEvent')}
          onPress={() => controller.navigate('EventCreateScreen')}
          fullWidth
        />
      </ScrollView>
    </AppScreenTemplate>
  );
}
