import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTranslation } from '@dawwar/i18n';
import { Button, Icon, ScreenTemplate, Text } from '@dawwar/ui';
import { useTheme, radius, space, typography } from '@dawwar/theme';
import { PROFILE_ROUTES } from '../../../navigation/routes';
import {
  DEFAULT_PAYMENT_METHODS,
  readSavedPaymentMethods,
  readSelectedPaymentMethod,
  writeSelectedPaymentMethod,
  type SavedPaymentMethod,
} from '../core/paymentMethods';

function getIcon(kind: string) {
  const icons: Record<string, string> = {
    cash: 'cash',
    google_pay: 'google',
    apple_pay: 'apple',
    instapay: 'bank-transfer',
    vodafone_cash: 'cellphone',
    card: 'credit-card-outline',
  };
  return icons[kind] ?? 'credit-card-outline';
}

export function PaymentMethodsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const [selected, setSelected] = React.useState(readSelectedPaymentMethod());
  const [cards, setCards] = React.useState<SavedPaymentMethod[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      setCards(readSavedPaymentMethods());
      setSelected(readSelectedPaymentMethod());
    }, []),
  );

  const methods = React.useMemo(() => [...DEFAULT_PAYMENT_METHODS, ...cards], [cards]);

  const handleApply = () => {
    writeSelectedPaymentMethod(selected);
    navigation.goBack();
  };

  return (
    <ScreenTemplate
      headerProps={{
        title: t('payment_methods.title'),
        onBackPress: () => navigation.goBack(),
      }}
      footer={
        <View style={styles.footer}>
          <Button label={t('common.apply')} onPress={handleApply} fullWidth style={styles.applyBtn} />
        </View>
      }
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {methods.map((method) => {
          const checked = selected === method.id;
          return (
            <TouchableOpacity
              key={method.id}
              style={[styles.methodRow, checked && styles.methodSelected]}
              onPress={() => setSelected(method.id)}
              activeOpacity={0.85}
            >
              <View style={styles.methodIcon}>
                <Icon name={getIcon(method.kind)} size={22} color={colors.primary} />
              </View>
              <View style={styles.methodText}>
                <Text style={styles.methodLabel}>{t(method.label)}</Text>
                {method.masked ? <Text style={styles.methodSub}>{method.masked}</Text> : null}
              </View>
              <View style={[styles.radio, checked && styles.radioSelected]}>
                {checked ? <View style={styles.radioDot} /> : null}
              </View>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={styles.addCardRow}
          onPress={() => navigation.navigate(PROFILE_ROUTES.ADD_PAYMENT_METHOD)}
          activeOpacity={0.85}
        >
          <Icon name="plus" size={20} color={colors.primary} />
          <Text style={styles.addCardText}>{t('payment_methods.add_card')}</Text>
        </TouchableOpacity>
      </ScrollView>
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
    methodRow: {
      minHeight: 58,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      paddingHorizontal: space.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.sm,
    },
    methodSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight,
    },
    methodIcon: {
      width: 34,
      alignItems: 'center',
    },
    methodText: {
      flex: 1,
    },
    methodLabel: {
      ...typography.body2,
      color: colors.text,
      fontWeight: '800',
      textAlign: 'auto',
    },
    methodSub: {
      ...typography.caption,
      color: colors.textSecondary,
      marginTop: 2,
      textAlign: 'auto',
    },
    radio: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: colors.textTertiary,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
    },
    radioSelected: {
      borderColor: colors.primary,
    },
    radioDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.primary,
    },
    addCardRow: {
      minHeight: 58,
      borderRadius: radius.md,
      backgroundColor: colors.primaryLight,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: space.sm,
      marginTop: space.sm,
    },
    addCardText: {
      ...typography.body2,
      color: colors.primary,
      fontWeight: '900',
    },
    footer: {
      paddingHorizontal: space.base,
      paddingTop: space.sm,
      paddingBottom: space.lg,
      backgroundColor: colors.surface,
    },
    applyBtn: {
      height: 54,
      borderRadius: radius.full,
    },
  });
