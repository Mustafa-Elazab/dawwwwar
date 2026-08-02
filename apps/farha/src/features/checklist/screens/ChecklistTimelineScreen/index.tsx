import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppButton, AppCard, AppText, EmptyState, SectionHeader, StepIndicator } from '@dawwar/ui';

import { ChecklistRow } from '../../components';
import { MissingEvent, ScreenFrame } from '../../../planner/components';
import { useController } from './controller';
import { createStyles } from './styles';

export function ChecklistTimelineScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();

  if (!ctrl.event) return <MissingEvent />;

  return (
    <ScreenFrame title={t('farha.phase1.checklist.title')} subtitle={ctrl.event.title} showTabs>
      <AppCard variant="outlined" style={styles.section}>
        <SectionHeader title={t('farha.phase1.checklist.progressTitle')} />
        <StepIndicator
          steps={[
            t('farha.phase1.checklist.pending'),
            t('farha.phase1.checklist.done'),
            t('farha.phase1.checklist.skipped'),
          ]}
          currentStep={ctrl.currentStep}
        />
        <AppText variant="h3" align="auto">
          {t('farha.phase1.checklist.progress', {
            done: ctrl.summary.doneCount,
            total: ctrl.summary.actionableTotal,
          })}
        </AppText>
      </AppCard>
      <AppButton label={t('farha.phase1.actions.addTask')} onPress={ctrl.addTask} fullWidth />
      {ctrl.items.length ? (
        <View style={styles.stack}>
          {ctrl.items.map((item) => (
            <ChecklistRow
              key={item.id}
              item={item}
              onPress={() => ctrl.editTask(item.id)}
              onMarkDone={() => ctrl.markDone(item.id)}
            />
          ))}
        </View>
      ) : (
        <EmptyState title={t('farha.phase1.checklist.emptyTitle')} subtitle={t('farha.phase1.checklist.emptyBody')} />
      )}
    </ScreenFrame>
  );
}
