import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppButton, EmptyState } from '@dawwar/ui';

import { EventCard } from '../../components';
import { ScreenFrame } from '../../../planner/components';
import type { Phase1ScreenProps } from '../../../planner/types/screenTypes';
import { createStyles } from './styles';
import { useController } from '../../hooks/useEventListController';

export function EventListScreen({ controller }: Phase1ScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController(controller);

  return (
    <ScreenFrame title={t('farha.phase1.eventList.title')} subtitle={t('farha.phase1.eventList.subtitle')}>
      {ctrl.events.length ? (
        <View style={styles.stack}>
          {ctrl.events.map((event) => (
            <EventCard
              key={event.id}
              controller={controller}
              event={event}
              onPress={() => ctrl.openEvent(event.id)}
            />
          ))}
        </View>
      ) : (
        <EmptyState title={t('farha.phase1.eventList.emptyTitle')} subtitle={t('farha.phase1.eventList.emptyBody')} />
      )}
      <AppButton
        label={t('farha.phase1.actions.addEvent')}
        onPress={ctrl.addEvent}
        fullWidth
      />
    </ScreenFrame>
  );
}
