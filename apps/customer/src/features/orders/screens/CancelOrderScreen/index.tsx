import React from 'react';
import { Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from '@dawwar/i18n';
import { Button, Icon, ScreenTemplate, Text } from '@dawwar/ui';
import { useTheme, radius, shadows, space, typography } from '@dawwar/theme';
import { ORDER_ROUTES } from '../../../../navigation/routes';
import { useCancelOrder } from '../../core/hooks';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { OrdersStackParamList } from '../../../../navigation/types';

const REASONS = [
  'change_mind',
  'better_price',
  'delivery_delay',
  'wrong_item',
  'duplicate_order',
  'cannot_fulfill',
  'other',
] as const;

export function CancelOrderScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const route = useRoute<RouteProp<OrdersStackParamList, typeof ORDER_ROUTES.CANCEL_ORDER>>();
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList>>();
  const cancelOrder = useCancelOrder();
  const [selected, setSelected] = React.useState<string | null>(null);
  const [otherReason, setOtherReason] = React.useState('');
  const [showDone, setShowDone] = React.useState(false);

  const reasonText =
    selected === 'other'
      ? otherReason.trim()
      : selected
        ? t(`cancel_order.reasons.${selected}`)
        : '';

  const canSubmit = selected !== null && (selected !== 'other' || otherReason.trim().length > 2);

  const submit = async () => {
    if (!canSubmit) return;
    await cancelOrder.mutateAsync({ orderId: route.params.orderId, reason: reasonText });
    setShowDone(true);
  };

  const closeDone = () => {
    setShowDone(false);
    navigation.navigate(ORDER_ROUTES.ORDERS_LIST);
  };

  return (
    <ScreenTemplate
      headerProps={{
        title: t('cancel_order.title'),
        onBackPress: () => navigation.goBack(),
      }}
      footer={
        <View style={styles.footer}>
          <Button
            label={t('common.submit', 'Submit')}
            onPress={submit}
            loading={cancelOrder.isPending}
            disabled={!canSubmit}
            fullWidth
            style={styles.submitBtn}
          />
        </View>
      }
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {REASONS.map((reason) => {
          const checked = selected === reason;
          return (
            <TouchableOpacity
              key={reason}
              style={[styles.reasonRow, checked && styles.reasonRowSelected]}
              onPress={() => setSelected(reason)}
              activeOpacity={0.8}
            >
              <View style={[styles.radio, checked && styles.radioSelected]}>
                {checked ? <View style={styles.radioDot} /> : null}
              </View>
              <Text style={styles.reasonText}>{t(`cancel_order.reasons.${reason}`)}</Text>
            </TouchableOpacity>
          );
        })}

        {selected === 'other' ? (
          <TextInput
            value={otherReason}
            onChangeText={setOtherReason}
            placeholder={t('cancel_order.other_placeholder')}
            placeholderTextColor={colors.placeholder}
            multiline
            style={styles.otherInput}
          />
        ) : null}
      </ScrollView>

      <Modal transparent visible={showDone} animationType="fade" onRequestClose={closeDone}>
        <View style={styles.modalOverlay}>
          <View style={styles.doneCard}>
            <TouchableOpacity style={styles.modalClose} onPress={closeDone}>
              <Icon name="close" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
            <View style={styles.doneIcon}>
              <Icon name="heart" size={58} color={colors.primary} />
            </View>
            <Text style={styles.doneTitle}>{t('cancel_order.done_title')}</Text>
            <Text style={styles.doneBody}>{t('cancel_order.done_body')}</Text>
            <Button label={t('common.ok')} onPress={closeDone} fullWidth style={styles.okBtn} />
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
    reasonRow: {
      minHeight: 58,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      paddingHorizontal: space.base,
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.md,
    },
    reasonRowSelected: {
      borderColor: colors.primary,
    },
    radio: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 1.5,
      borderColor: colors.textTertiary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioSelected: {
      borderColor: colors.primary,
    },
    radioDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.primary,
    },
    reasonText: {
      ...typography.body2,
      color: colors.text,
      flex: 1,
      textAlign: 'auto',
    },
    otherInput: {
      minHeight: 100,
      borderRadius: radius.md,
      backgroundColor: colors.surfaceVariant,
      padding: space.base,
      color: colors.text,
      textAlignVertical: 'top',
      ...typography.body2,
    },
    footer: {
      paddingHorizontal: space.base,
      paddingTop: space.sm,
      paddingBottom: space.lg,
      backgroundColor: colors.surface,
    },
    submitBtn: {
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
    doneCard: {
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
      right: space.sm,
      width: 34,
      height: 34,
      alignItems: 'center',
      justifyContent: 'center',
    },
    doneIcon: {
      width: 94,
      height: 94,
      borderRadius: 47,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: space.md,
    },
    doneTitle: {
      ...typography.h4,
      color: colors.text,
      fontWeight: '900',
      textAlign: 'center',
      marginBottom: space.sm,
    },
    doneBody: {
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
