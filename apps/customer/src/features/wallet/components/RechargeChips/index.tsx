import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text, Button } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import RTLTextInput from '../../../../components/RTLTextInput';
import { createStyles } from './styles';

const PRESET_AMOUNTS = [50, 100, 200, 500];

interface RechargeChipsProps {
  selectedAmount: number | null;
  customAmount: string;
  showCustomInput: boolean;
  effectiveAmount: number | null;
  rechargeError: string | null;
  isRecharging: boolean;
  onAmountSelect: (amount: number) => void;
  onCustomAmountSelect: () => void;
  onCustomAmountChange: (amount: string) => void;
  onRecharge: () => void;
}

export function RechargeChips({
  selectedAmount,
  customAmount,
  showCustomInput,
  effectiveAmount,
  rechargeError,
  isRecharging,
  onAmountSelect,
  onCustomAmountSelect,
  onCustomAmountChange,
  onRecharge,
}: RechargeChipsProps) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { t } = useTranslation();
  const hasAmount = effectiveAmount !== null;
  const currentAmount = showCustomInput ? customAmount : effectiveAmount;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('wallet.select_amount')}</Text>
      <View style={styles.row}>
        {PRESET_AMOUNTS.map((amount) => (
          <TouchableOpacity
            key={amount}
            style={[styles.chip, selectedAmount === amount && styles.chipSelected]}
            onPress={() => onAmountSelect(amount)}
          >
            <Text style={[styles.chipLabel, selectedAmount === amount && styles.chipLabelSelected]}>
              {amount} {t('common.egp')}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.chip, showCustomInput && styles.chipSelected]}
          onPress={onCustomAmountSelect}
        >
          <Text style={[styles.chipLabel, showCustomInput && styles.chipLabelSelected]}>
            {t('wallet.custom_amount')}
          </Text>
        </TouchableOpacity>
        {showCustomInput && (
          <RTLTextInput
            style={styles.customInput}
            value={customAmount}
            onChangeText={onCustomAmountChange}
            placeholder={t('wallet.custom_placeholder')}
            placeholderTextColor={colors.placeholder}
            keyboardType="numeric"
            autoFocus
          />
        )}
      </View>
      <Button
        label={hasAmount
          ? `${t('wallet.recharge')} ${currentAmount} ${t('common.egp')}`
          : t('wallet.select_amount_first')}
        onPress={onRecharge}
        loading={isRecharging}
        disabled={!hasAmount}
        fullWidth
        style={[styles.confirmBtn, !hasAmount && styles.confirmBtnDisabled]}
      />
      {hasAmount ? (
        <Text style={styles.note}>{t('wallet.recharge_note')}</Text>
      ) : null}
      {rechargeError ? (
        <Text style={styles.errorText}>{rechargeError}</Text>
      ) : null}
    </View>
  );
}
