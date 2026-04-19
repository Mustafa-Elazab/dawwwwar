import React, { useState, useEffect } from 'react';
import { Modal, View, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text, Button } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { useOtpCountdown } from '../../../../../features/auth/hooks/useOtpCountdown';
import { createStyles } from './styles';
import type { NewOrderModalProps } from './types';
import { space } from '@dawwar/theme';

const PREP_OPTIONS = [10, 15, 20, 30] as const;
const AUTO_REJECT_SECONDS = 300; // 5 minutes

export function NewOrderModal({ order, onAccept, onReject, isAccepting, visible }: NewOrderModalProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();
  const [selectedPrep, setSelectedPrep] = useState<number>(15);
  const timer = useOtpCountdown({ initialSeconds: AUTO_REJECT_SECONDS, autoStart: visible });

  // Auto-reject when timer expires
  useEffect(() => {
    if (timer.isExpired && visible) {
      onReject();
    }
  }, [timer.isExpired, visible, onReject]);

  // Reset timer when modal opens
  useEffect(() => {
    if (visible) timer.reset(AUTO_REJECT_SECONDS);
  }, [visible]);

  if (!order) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <ScrollView showsVerticalScrollIndicator={false}>

            {/* Alert header */}
            <View style={styles.alertHeader}>
              <Text style={styles.alertTitle}>🔔 {t('merchant_app.new_order_title')}</Text>
              <Text style={styles.alertAmount}>{order.total} {t('common.egp')}</Text>
              <Text style={styles.timerText}>
                {t('merchant_app.auto_reject_warning', {
                  seconds: timer.seconds,
                })}
              </Text>
            </View>

            {/* Order items */}
            {order.items?.map((item) => (
              <Text key={item.id} variant="body2" color={colors.textSecondary}
                style={{ paddingHorizontal: space.sm, paddingVertical: 2 }}>
                {item.quantity}× {item.productName}
              </Text>
            ))}

            {/* Prep time selector */}
            <View style={styles.prepSection}>
              <Text style={styles.prepLabel}>{t('merchant_app.prep_time')}</Text>
              <View style={styles.prepRow}>
                {PREP_OPTIONS.map((min) => (
                  <TouchableOpacity
                    key={min}
                    style={[styles.prepChip, selectedPrep === min && styles.prepChipSelected]}
                    onPress={() => setSelectedPrep(min)}
                  >
                    <Text
                      style={styles.prepChipLabel}
                      color={selectedPrep === min ? colors.primary : colors.text}
                    >
                      {min} {t('common.min')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Actions */}
            <Button
              label={t('merchant_app.accept')}
              onPress={() => onAccept(selectedPrep)}
              loading={isAccepting}
              fullWidth
              style={styles.acceptBtn}
            />
            <Button
              label={t('merchant_app.reject')}
              onPress={onReject}
              variant="ghost"
              fullWidth
              style={styles.rejectBtn}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
