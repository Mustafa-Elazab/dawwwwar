import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppButton, AppScreenTemplate, EmptyState } from '@dawwar/ui';

import { BudgetItemRow } from '../../components';
import { getCategoryName } from '../../utils/categoryLabels';
import { usePlannerScreenChrome } from '../../../planner/hooks/usePlannerScreenChrome';
import { useController } from './controller';
import { createStyles } from './styles';

export function BudgetItemListScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();
  const screen = usePlannerScreenChrome({
    title: ctrl.category ? getCategoryName(t, ctrl.category) : t('farha.phase1.errors.missingCategory'),
    subtitle: ctrl.category ? t('farha.phase1.budgetItems.subtitle') : undefined,
    showBack: true,
  });

  if (!ctrl.category) {
    return <AppScreenTemplate {...screen.templateProps} />;
  }

  return (
    <AppScreenTemplate {...screen.templateProps}>
      <ScrollView {...screen.scrollViewProps}>
        <AppButton label={t('farha.phase1.actions.addItem')} onPress={ctrl.addItem} fullWidth />
        {ctrl.items.length ? (
          <View style={styles.stack}>
            {ctrl.items.map((item) => (
              <BudgetItemRow
                key={item.id}
                item={item}
                onPress={() => ctrl.editItem(item.id)}
              />
            ))}
          </View>
        ) : (
          <EmptyState title={t('farha.phase1.budgetItems.emptyTitle')} subtitle={t('farha.phase1.budgetItems.emptyBody')} />
        )}
      </ScrollView>
    </AppScreenTemplate>
  );
}
