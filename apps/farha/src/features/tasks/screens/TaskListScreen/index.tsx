import React, { useMemo, useRef } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import {
  AppButton,
  AppCard,
  AppInput,
  AppScreenTemplate,
  AppText,
  EmptyState,
  SectionHeader,
  SegmentedControl,
} from '@dawwar/ui';

import { BudgetSummaryCard } from '../../../budget/components';
import { FarhaAdBanner } from '../../../monetization/ads/FarhaAdBanner';
import { usePlannerScreenChrome } from '../../../planner/hooks/usePlannerScreenChrome';
import { MissingEventState } from '../../../planner/states/MissingEventState';
import { WalkthroughTarget } from '../../../tips/components/WalkthroughTargetContext';
import { TaskRow } from '../../components';
import { useController } from './controller';
import { createStyles } from './styles';

export function TaskListScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const scrollRef = useRef<ScrollView>(null);
  const ctrl = useController();
  const screen = usePlannerScreenChrome({
    title: t('farha.phase1.tasks.title'),
    subtitle: ctrl.event?.title,
    showTabs: true,
  });

  if (!ctrl.event) return <MissingEventState />;

  return (
    <AppScreenTemplate {...screen.templateProps}>
      <ScrollView ref={scrollRef} {...screen.scrollViewProps}>
        <Animated.View entering={FadeInUp.duration(260)}>
          <BudgetSummaryCard title={t('farha.phase1.tasks.summaryTitle')} totals={ctrl.totals} />
        </Animated.View>
        <AppCard variant="outlined" style={styles.section}>
          <SectionHeader title={t('farha.phase1.tasks.progressTitle')} />
          <AppText variant="h3" align="auto">
            {t('farha.phase1.checklist.progress', {
              done: ctrl.summary.doneCount,
              total: ctrl.summary.actionableTotal,
            })}
          </AppText>
        </AppCard>
        <View style={styles.centeredToggle}>
          <SegmentedControl
            items={[
              { key: 'dueDate', label: t('farha.phase1.tasks.groupByDueDate') },
              { key: 'category', label: t('farha.phase1.tasks.groupByCategory') },
            ]}
            activeKey={ctrl.grouping}
            onChange={(key) => ctrl.setGrouping(key === 'category' ? 'category' : 'dueDate')}
          />
        </View>
        <WalkthroughTarget step="addTask" scrollRef={scrollRef}>
          <AppButton label={t('farha.phase1.actions.addTask')} onPress={ctrl.addTask} fullWidth />
        </WalkthroughTarget>
        <FarhaAdBanner isPro={ctrl.isPro} placement="tasks" />
        {ctrl.paymentTask ? (
          <View style={styles.paymentBox}>
            <SectionHeader title={t('farha.phase1.tasks.logPayment')} />
            <AppText variant="body2" color={colors.textSecondary} align="auto">
              {ctrl.paymentTask.titleKey ? t(ctrl.paymentTask.titleKey) : ctrl.paymentTask.title}
            </AppText>
            <AppInput
              label={t('farha.phase1.labels.amount')}
              keyboardType="numeric"
              value={ctrl.paymentAmount}
              onChangeText={ctrl.setPaymentAmount}
            />
            <View style={styles.wrapRow}>
              <AppButton label={t('farha.phase1.tasks.logPayment')} size="sm" onPress={ctrl.logPayment} />
              <AppButton label={t('farha.phase1.confirm.cancel')} size="sm" variant="outline" onPress={ctrl.cancelPayment} />
            </View>
          </View>
        ) : null}
        {ctrl.tasks.length ? (
          <View style={styles.stack}>
            {ctrl.groups.map((group) => (
              <View key={group.key} style={styles.stack}>
                <SectionHeader title={group.titleKey ? t(group.titleKey) : group.title === 'none' ? t('farha.phase1.labels.none') : group.title} />
                {group.tasks.map((task, index) => (
                  <Animated.View key={task.id} entering={FadeInUp.delay(index * 55).duration(280)}>
                    <TaskRow
                      task={task}
                      isCelebrating={ctrl.celebratingTaskId === task.id}
                      onPress={() => ctrl.editTask(task.id)}
                      onMarkDone={() => ctrl.markDone(task.id)}
                      onLogPayment={() => ctrl.openPayment(task)}
                    />
                  </Animated.View>
                ))}
              </View>
            ))}
          </View>
        ) : (
          <EmptyState title={t('farha.phase1.tasks.emptyTitle')} subtitle={t('farha.phase1.tasks.emptyBody')} />
        )}
      </ScrollView>
    </AppScreenTemplate>
  );
}
