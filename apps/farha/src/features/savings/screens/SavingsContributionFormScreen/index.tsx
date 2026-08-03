import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppButton, AppInput, AppScreenTemplate } from '@dawwar/ui';

import { DateField } from '../../../planner/components/DateField';
import { usePlannerScreenChrome } from '../../../planner/hooks/usePlannerScreenChrome';
import { MissingEventState } from '../../../planner/states/MissingEventState';
import { useController } from './controller';
import { createStyles } from './styles';

export function SavingsContributionFormScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();
  const screen = usePlannerScreenChrome({
    title: ctrl.editingContribution
      ? t('farha.phase1.savings.editContribution')
      : t('farha.phase1.savings.addContribution'),
    subtitle: ctrl.event?.title,
    showBack: true,
  });

  if (!ctrl.event) return <MissingEventState />;

  return (
    <AppScreenTemplate {...screen.templateProps}>
      <ScrollView {...screen.scrollViewProps}>
        <View style={styles.stack}>
          <AppInput
            label={t('farha.phase1.labels.amount')}
            keyboardType="numeric"
            value={ctrl.form.amount}
            onChangeText={(amount) => ctrl.setForm((current) => ({ ...current, amount }))}
            error={ctrl.submitted && ctrl.validation.errors.amount ? t('farha.phase1.validation.invalidAmount') : undefined}
          />
          <DateField
            testID="farha-savings-contribution-date"
            label={t('farha.phase1.labels.date')}
            placeholder={t('farha.phase1.labels.datePlaceholder')}
            value={ctrl.form.date}
            onChange={(date) => ctrl.setForm((current) => ({ ...current, date }))}
          />
          <AppInput
            label={t('farha.phase1.labels.notes')}
            value={ctrl.form.note}
            onChangeText={(note) => ctrl.setForm((current) => ({ ...current, note }))}
            multiline
            numberOfLines={3}
          />
        </View>
        <AppButton label={t('farha.phase1.actions.save')} onPress={ctrl.save} fullWidth />
        {ctrl.editingContribution ? (
          <AppButton
            label={t('farha.phase1.savings.deleteContribution')}
            variant="danger"
            onPress={ctrl.deleteContribution}
            fullWidth
          />
        ) : null}
      </ScrollView>
    </AppScreenTemplate>
  );
}
