import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppButton, EmptyState } from '@dawwar/ui';

import { BudgetItemRow } from '../../components';
import { getCategoryName } from '../../utils/categoryLabels';
import { ScreenFrame } from '../../../planner/components';
import { useController } from './controller';
import { createStyles } from './styles';

export function BudgetItemListScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();

  if (!ctrl.category) {
    return <ScreenFrame title={t('farha.phase1.errors.missingCategory')} showBack />;
  }

  return (
    <ScreenFrame
      title={getCategoryName(t, ctrl.category)}
      subtitle={t('farha.phase1.budgetItems.subtitle')}
      showBack
    >
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
    </ScreenFrame>
  );
}
