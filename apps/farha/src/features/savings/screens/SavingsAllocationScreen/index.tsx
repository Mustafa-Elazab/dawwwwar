import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppButton, AppCard, AppInput, AppScreenTemplate, AppText, EmptyState, SectionHeader } from '@dawwar/ui';

import { getCategoryName } from '../../../budget/utils/categoryLabels';
import { usePlannerController } from '../../../../core/planner/context/PlannerControllerContext';
import { usePlannerScreenChrome } from '../../../planner/hooks/usePlannerScreenChrome';
import { MissingEventState } from '../../../planner/states/MissingEventState';
import { money } from '../../../planner/utils/helpers';
import { useController } from './controller';
import { createStyles } from './styles';

export function SavingsAllocationScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const appController = usePlannerController();
  const ctrl = useController();
  const screen = usePlannerScreenChrome({
    title: t('farha.phase1.savings.allocateFunds'),
    subtitle: ctrl.event?.title,
    showBack: true,
  });

  if (!ctrl.event) return <MissingEventState />;

  return (
    <AppScreenTemplate {...screen.templateProps}>
      <ScrollView {...screen.scrollViewProps}>
        <AppCard variant="outlined" style={styles.section}>
          <SectionHeader title={t('farha.phase1.savings.availableBalance')} />
          <AppText variant="h2" align="auto">{money(t, ctrl.summary.balance)}</AppText>
          <AppText variant="caption" color={colors.textSecondary} align="auto">
            {t('farha.phase1.savings.allocationTotal', {
              amount: money(t, ctrl.totalAllocation),
            })}
          </AppText>
          <AppButton
            label={t('farha.phase1.savings.suggestAllocation')}
            variant="outline"
            onPress={ctrl.suggestAllocation}
            disabled={!ctrl.items.length || ctrl.summary.balance <= 0}
            fullWidth
          />
        </AppCard>
        {ctrl.items.length ? (
          <View style={styles.stack}>
            {ctrl.items.map((item) => {
              const category = item.category && ctrl.event
                ? appController.getCategoryById(`${ctrl.event.id}-${item.category}`)
                : undefined;

              return (
                <AppCard key={item.id} variant="outlined" style={styles.section}>
                  <View style={styles.row}>
                    <View style={styles.rowText}>
                      <AppText variant="label" align="auto">{item.title}</AppText>
                      <AppText variant="caption" color={colors.textSecondary} align="auto">
                        {category ? getCategoryName(t, category) : t('farha.phase1.labels.none')}
                      </AppText>
                    </View>
                    <View style={styles.rowSide}>
                      <AppText variant="caption" color={colors.textSecondary} align="auto">
                        {t('farha.phase1.labels.balance')}
                      </AppText>
                      <AppText variant="label" align="auto">
                        {money(t, ctrl.getItemBalance(item))}
                      </AppText>
                    </View>
                  </View>
                  <AppInput
                    label={t('farha.phase1.savings.allocationAmount')}
                    keyboardType="numeric"
                    value={ctrl.allocationInputs[item.id] ?? ''}
                    onChangeText={(value) => ctrl.setAllocation(item.id, value)}
                  />
                </AppCard>
              );
            })}
          </View>
        ) : (
          <EmptyState
            title={t('farha.phase1.savings.noAllocatableItemsTitle')}
            subtitle={t('farha.phase1.savings.noAllocatableItemsBody')}
          />
        )}
        <AppButton
          label={t('farha.phase1.savings.confirmAllocation')}
          onPress={ctrl.confirmAllocation}
          disabled={ctrl.totalAllocation <= 0}
          fullWidth
        />
      </ScrollView>
    </AppScreenTemplate>
  );
}
