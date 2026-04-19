import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text, Icon } from '@dawwar/ui';
import { TransactionType } from '@dawwar/types';
import { space, typography } from '@dawwar/theme';
import { useTranslation } from '@dawwar/i18n';
import type { WalletTransaction } from '@dawwar/types';

interface DeliveryHistoryItemProps { transaction: WalletTransaction; }

export function DeliveryHistoryItem({ transaction }: DeliveryHistoryItemProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const isCredit = transaction.type === TransactionType.CREDIT;

  return (
    <View style={[styles.row, { borderBottomColor: colors.borderLight }]}>
      <View style={[styles.icon, { backgroundColor: isCredit ? colors.successBg : colors.errorBg }]}>
        <Icon
          name={isCredit ? 'arrow-down-circle' : 'arrow-up-circle'}
          size={20}
          color={isCredit ? colors.success : colors.error}
        />
      </View>
      <View style={styles.info}>
        <Text variant="label" color={colors.text}>{t(`wallet.reason.${transaction.reason}`)}</Text>
        <Text variant="caption" color={colors.textSecondary}>
          {new Date(transaction.createdAt).toLocaleDateString('ar-EG')}
        </Text>
      </View>
      <Text
        variant="label"
        color={isCredit ? colors.success : colors.error}
        style={{ fontWeight: '700' }}
      >
        {isCredit ? '+' : '-'}{transaction.amount} {t('common.egp')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: space.md, paddingHorizontal: space.base,
    gap: space.md, borderBottomWidth: 1,
  },
  icon: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  info: { flex: 1 },
});
