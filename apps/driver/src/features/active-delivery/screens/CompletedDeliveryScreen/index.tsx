import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ScreenTemplate, Text, Button } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { space, typography } from '@dawwar/theme';
import { useTranslation } from '@dawwar/i18n';
import { TAB_ROUTES } from '../../../navigation/routes';
import type { RouteProp } from '@react-navigation/native';
import type { ActiveDeliveryStackParamList } from '../../../../navigation/types';
import type { DRIVER_ROUTES } from '../../../navigation/routes';

export function CompletedDeliveryScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<ActiveDeliveryStackParamList, typeof DRIVER_ROUTES.COMPLETED_DELIVERY>>();
  const { netEarnings } = route.params;

  return (
    <ScreenTemplate edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Text style={styles.emoji}>🎉</Text>
        <Text variant="h2" color={colors.text}>{t('driver.delivery_complete')}</Text>

        <View style={[styles.earningsCard, { backgroundColor: colors.successBg, borderRadius: 16 }]}>
          <Text variant="body2" color={colors.textSecondary}>{t('driver.your_earnings')}</Text>
          <Text style={[styles.earningsAmount, { color: colors.success }]}>
            {netEarnings} {t('common.egp')}
          </Text>
        </View>

        <Button
          label={t('driver.go_online_again')}
          onPress={() => navigation.navigate(TAB_ROUTES.AVAILABLE_ORDERS_TAB)}
          fullWidth
          style={styles.btn}
        />
        <Button
          label={t('driver.view_earnings')}
          onPress={() => navigation.navigate(TAB_ROUTES.EARNINGS_TAB)}
          variant="outline"
          fullWidth
        />
      </View>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: space.xl, gap: space.lg,
  },
  emoji: { fontSize: 72 },
  earningsCard: { padding: space.xl, alignItems: 'center', width: '100%', gap: space.sm },
  earningsAmount: { fontSize: 48, fontWeight: '800' },
  btn: { marginTop: space.md },
});
