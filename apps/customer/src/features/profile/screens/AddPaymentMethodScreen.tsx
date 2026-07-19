import React from 'react';
import { Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '@dawwar/i18n';
import { Button, Icon, ScreenTemplate, Text } from '@dawwar/ui';
import { useTheme, radius, shadows, space, typography } from '@dawwar/theme';
import { addSavedCard } from '../core/paymentMethods';

export function AddPaymentMethodScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const [cardName, setCardName] = React.useState('');
  const [cardNumber, setCardNumber] = React.useState('');
  const [expiry, setExpiry] = React.useState('');
  const [cvc, setCvc] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const digits = cardNumber.replace(/\D/g, '');
  const last4 = digits.slice(-4);
  const canSave = digits.length >= 12 && cardName.trim().length > 2 && expiry.trim().length >= 4 && cvc.trim().length >= 3;

  const handleSave = () => {
    if (!canSave) return;
    addSavedCard({
      id: `card_${last4}_${Date.now()}`,
      masked: `**** **** **** ${last4}`,
      holderName: cardName.trim(),
      expiry: expiry.trim(),
    });
    setSuccess(true);
  };

  const closeSuccess = () => {
    setSuccess(false);
    navigation.goBack();
  };

  return (
    <ScreenTemplate
      headerProps={{
        title: t('paymentMethods.add_card'),
        onBackPress: () => navigation.goBack(),
      }}
      footer={
        <View style={styles.footer}>
          <Button
            label={t('common.save')}
            onPress={handleSave}
            disabled={!canSave}
            fullWidth
            style={styles.saveBtn}
          />
        </View>
      }
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.cardPreview}>
          <View style={styles.chip} />
          <Text style={styles.cardBrand}>VISA</Text>
          <Text style={styles.cardNumber}>
            {last4 ? `**** **** **** ${last4}` : '**** **** **** ----'}
          </Text>
          <View style={styles.cardBottom}>
            <View>
              <Text style={styles.cardMetaLabel}>{t('paymentMethods.cardholder_name')}</Text>
              <Text style={styles.cardMeta}>{cardName || '-'}</Text>
            </View>
            <View>
              <Text style={styles.cardMetaLabel}>{t('paymentMethods.expiry')}</Text>
              <Text style={styles.cardMeta}>{expiry || '--/--'}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.inputLabel}>{t('paymentMethods.cardholder_name')}</Text>
        <TextInput
          value={cardName}
          onChangeText={setCardName}
          placeholder={t('paymentMethods.cardholder_name')}
          placeholderTextColor={colors.placeholder}
          style={styles.input}
        />

        <Text style={styles.inputLabel}>{t('paymentMethods.card_number')}</Text>
        <TextInput
          value={cardNumber}
          onChangeText={setCardNumber}
          placeholder="4848 0402 9858 5529"
          placeholderTextColor={colors.placeholder}
          keyboardType="number-pad"
          style={styles.input}
        />

        <View style={styles.inlineInputs}>
          <View style={styles.inlineInputWrap}>
            <Text style={styles.inputLabel}>{t('paymentMethods.expiry')}</Text>
            <TextInput
              value={expiry}
              onChangeText={setExpiry}
              placeholder="12/35"
              placeholderTextColor={colors.placeholder}
              style={styles.input}
            />
          </View>
          <View style={styles.inlineInputWrap}>
            <Text style={styles.inputLabel}>{t('paymentMethods.cvc')}</Text>
            <TextInput
              value={cvc}
              onChangeText={setCvc}
              placeholder="123"
              placeholderTextColor={colors.placeholder}
              keyboardType="number-pad"
              style={styles.input}
            />
          </View>
        </View>
      </ScrollView>

      <Modal transparent visible={success} animationType="fade" onRequestClose={closeSuccess}>
        <View style={styles.modalOverlay}>
          <View style={styles.successCard}>
            <TouchableOpacity style={styles.modalClose} onPress={closeSuccess}>
              <Icon name="close" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
            <View style={styles.successIcon}>
              <Icon name="party-popper" size={58} color={colors.primary} />
            </View>
            <Text style={styles.successTitle}>{t('paymentMethods.success_title')}</Text>
            <Text style={styles.successBody}>{t('paymentMethods.success_body')}</Text>
            <Button label={t('paymentMethods.success_button')} onPress={closeSuccess} fullWidth style={styles.okBtn} />
          </View>
        </View>
      </Modal>
    </ScreenTemplate>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    content: {
      padding: space.base,
      paddingBottom: 120,
      gap: space.sm,
    },
    cardPreview: {
      height: 170,
      borderRadius: radius.md,
      backgroundColor: colors.primary,
      padding: space.base,
      justifyContent: 'space-between',
      marginBottom: space.lg,
      ...shadows.md,
    },
    chip: {
      width: 42,
      height: 28,
      borderRadius: 5,
      backgroundColor: '#fff',
      opacity: 0.9,
    },
    cardBrand: {
      position: 'absolute',
      top: space.base,
      end: space.base,
      ...typography.label,
      color: '#fff',
      fontWeight: '900',
    },
    cardNumber: {
      ...typography.h3,
      color: '#fff',
      fontWeight: '900',
    },
    cardBottom: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    cardMetaLabel: {
      ...typography.overline,
      color: 'rgba(255,255,255,0.75)',
    },
    cardMeta: {
      ...typography.caption,
      color: '#fff',
      fontWeight: '800',
      marginTop: 2,
    },
    inputLabel: {
      ...typography.caption,
      color: colors.textSecondary,
      fontWeight: '800',
      marginBottom: -2,
    },
    input: {
      minHeight: 50,
      borderRadius: radius.sm,
      backgroundColor: colors.surfaceVariant,
      color: colors.text,
      paddingHorizontal: space.md,
      ...typography.body2,
    },
    inlineInputs: {
      flexDirection: 'row',
      gap: space.sm,
    },
    inlineInputWrap: {
      flex: 1,
      gap: space.xs,
    },
    footer: {
      paddingHorizontal: space.base,
      paddingTop: space.sm,
      paddingBottom: space.lg,
      backgroundColor: colors.surface,
    },
    saveBtn: {
      height: 54,
      borderRadius: radius.full,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      alignItems: 'center',
      justifyContent: 'center',
      padding: space.xl,
    },
    successCard: {
      width: '100%',
      borderRadius: radius.lg,
      backgroundColor: colors.surface,
      padding: space.xl,
      alignItems: 'center',
      ...shadows.lg,
    },
    modalClose: {
      position: 'absolute',
      top: space.sm,
      end: space.sm,
      width: 34,
      height: 34,
      alignItems: 'center',
      justifyContent: 'center',
    },
    successIcon: {
      width: 104,
      height: 104,
      borderRadius: 52,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: space.md,
    },
    successTitle: {
      ...typography.h4,
      color: colors.text,
      fontWeight: '900',
      textAlign: 'center',
      marginBottom: space.sm,
    },
    successBody: {
      ...typography.body2,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: space.lg,
    },
    okBtn: {
      height: 52,
      borderRadius: radius.full,
    },
  });
