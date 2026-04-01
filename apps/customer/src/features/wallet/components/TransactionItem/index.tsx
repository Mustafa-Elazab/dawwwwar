import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text, Icon } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { TransactionType } from '@dawwar/types';
import type { WalletTransaction } from '@dawwar/types';
import { createStyles } from './styles';

interface TransactionItemProps {
  transaction: WalletTransaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const isCredit = transaction.type === TransactionType.CREDIT;

  return (
    <View style={styles.row}>
      <View style={[styles.iconCircle, isCredit ? styles.creditCircle : styles.debitCircle]}>
        <Icon
          name={isCredit ? 'arrow-down-circle' : 'arrow-up-circle'}
          size={22}
          color={isCredit ? colors.success : colors.error}
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.reason}>
          {t(`wallet.reason.${transaction.reason}`)}
        </Text>
        <Text style={styles.date}>
          {new Date(transaction.createdAt).toLocaleDateString('ar-EG')}
        </Text>
      </View>
      <View style={styles.amountCol}>
        <Text style={isCredit ? styles.amountCredit : styles.amountDebit}>
          {isCredit ? '+' : '-'}{transaction.amount} {t('common.egp')}
        </Text>
        <Text style={styles.balanceAfter}>
          {t('wallet.balance_after', { amount: transaction.balanceAfter })}
        </Text>
      </View>
    </View>
  );
}
