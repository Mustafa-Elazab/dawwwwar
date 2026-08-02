import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppButton, AppCard, AppText, EmptyState, SectionHeader, StepIndicator } from '@dawwar/ui';

import { ChecklistRow } from '../../components';
import { MissingEvent, ScreenFrame } from '../../../planner/components';
import type { Phase1ScreenProps } from '../../../planner/types/screenTypes';
import { createStyles } from './styles';
import { useController } from '../../hooks/useChecklistTimelineController';

export function ChecklistTimelineScreen({ controller }: Phase1ScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController(controller);

  if (!ctrl.event) return <MissingEvent controller={controller} />;

  return (
    <ScreenFrame title={t('farha.phase1.checklist.title')} subtitle={ctrl.event.title} controller={controller} showTabs>
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
              controller={controller}
              item={item}
              onPress={() => ctrl.editTask(item.id)}
            />
          ))}
        </View>
      ) : (
        <EmptyState title={t('farha.phase1.checklist.emptyTitle')} subtitle={t('farha.phase1.checklist.emptyBody')} />
      )}
    </ScreenFrame>
  );
}
