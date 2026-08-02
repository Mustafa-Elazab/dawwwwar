import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppButton, AppScreenTemplate, EmptyState } from '@dawwar/ui';

import { EventCard } from '../../components';
import { usePlannerScreenChrome } from '../../../planner/hooks/usePlannerScreenChrome';
import { useController } from './controller';
import { createStyles } from './styles';

export function EventListScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();
  const screen = usePlannerScreenChrome({
    title: t('farha.phase1.eventList.title'),
    subtitle: t('farha.phase1.eventList.subtitle'),
    showBack: true,
  });

  return (
    <AppScreenTemplate {...screen.templateProps}>
      <ScrollView {...screen.scrollViewProps}>
        {ctrl.events.length ? (
          <View style={styles.stack}>
            {ctrl.events.map(({ event, totals }) => (
              <EventCard
                key={event.id}
                event={event}
                totals={totals}
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
      </ScrollView>
    </AppScreenTemplate>
  );
}
