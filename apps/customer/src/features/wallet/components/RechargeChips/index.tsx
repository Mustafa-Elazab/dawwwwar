import React, { useState } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text, Button } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import RTLTextInput from '../../../../components/RTLTextInput';
import { useRecharge } from '../../core/hooks';
import { createStyles } from './styles';

const PRESET_AMOUNTS = [50, 100, 200, 500];

export function RechargeChips() {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { t } = useTranslation();
  const rechargeMutation = useRecharge();

  const [selected, setSelected] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const handleChipPress = (amount: number | 'custom') => {
    if (amount === 'custom') {
      setSelected(null);
      setShowCustom(true);
    } else {
      setSelected(amount);
      setShowCustom(false);
      setCustomAmount('');
    }
  };

  const handleConfirm = () => {
    const amount = showCustom ? parseFloat(customAmount) : (selected ?? 0);
    if (!amount || amount < 10) {
      Alert.alert(t('wallet.custom_min'));
      return;
    }
    Alert.alert(
      t('wallet.recharge_title'),
      `${amount} ${t('common.egp')}`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('wallet.confirm_recharge'),
          onPress: () => rechargeMutation.mutate(amount),
        },
      ],
    );
  };

  const isSelected = selected !== null || (showCustom && customAmount);
  const currentAmount = showCustom ? customAmount : selected;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('wallet.select_amount')}</Text>
      <View style={styles.row}>
        {PRESET_AMOUNTS.map((amount) => (
          <TouchableOpacity
            key={amount}
            style={[styles.chip, selected === amount && styles.chipSelected]}
            onPress={() => handleChipPress(amount)}
          >
            <Text style={[styles.chipLabel, selected === amount && styles.chipLabelSelected]}>
              {amount} {t('common.egp')}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.chip, showCustom && styles.chipSelected]}
          onPress={() => handleChipPress('custom')}
        >
          <Text style={[styles.chipLabel, showCustom && styles.chipLabelSelected]}>
            {t('wallet.custom_amount')}
          </Text>
        </TouchableOpacity>
        {showCustom && (
          <RTLTextInput
            style={styles.customInput}
            value={customAmount}
            onChangeText={setCustomAmount}
            placeholder={t('wallet.custom_placeholder')}
            placeholderTextColor={colors.placeholder}
            keyboardType="numeric"
            autoFocus
          />
        )}
      </View>
      <Button
        label={isSelected
          ? `${t('wallet.recharge')} ${currentAmount} ${t('common.egp')}`
          : t('wallet.select_amount_first')}
        onPress={handleConfirm}
        loading={rechargeMutation.isPending}
        disabled={!isSelected}
        fullWidth
        style={[
          styles.confirmBtn,
          !isSelected && { backgroundColor: colors.border, opacity: 0.5 }
        ]}
      />
      {isSelected && (
        <Text style={styles.note}>{t('wallet.recharge_note')}</Text>
      )}
    </View>
  );
}
