import React, { useMemo } from 'react';
import { ScrollView, Switch, View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppButton, AppCard, AppScreenTemplate, AppText, SectionHeader } from '@dawwar/ui';

import { usePlannerScreenChrome } from '../../../planner/hooks/usePlannerScreenChrome';
import { useController } from './controller';
import { createStyles } from './styles';

export function SettingsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();
  const screen = usePlannerScreenChrome({
    title: t('farha.phase1.settings.title'),
    subtitle: t('farha.phase1.settings.subtitle'),
    showTabs: true,
  });

  return (
    <AppScreenTemplate {...screen.templateProps}>
      <ScrollView {...screen.scrollViewProps}>
        <AppCard variant="outlined" style={styles.section}>
          <SectionHeader title={t('farha.phase1.settings.language')} />
          <View style={styles.wrapRow}>
            <AppButton
              label={t('farha.phase1.settings.arabic')}
              variant={ctrl.language === 'ar' ? 'primary' : 'outline'}
              onPress={ctrl.setArabic}
            />
            <AppButton
              label={t('farha.phase1.settings.english')}
              variant={ctrl.language === 'en' ? 'primary' : 'outline'}
              onPress={ctrl.setEnglish}
            />
          </View>
        </AppCard>
        <AppCard variant="outlined" style={styles.section}>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <AppText variant="label" align="auto">{t('farha.phase1.settings.notifications')}</AppText>
              <AppText variant="caption" color={colors.textSecondary} align="auto">
                {t('farha.phase1.settings.notificationsBody')}
              </AppText>
            </View>
            <Switch value={ctrl.notificationsEnabled} onValueChange={ctrl.setNotificationsEnabled} />
          </View>
        </AppCard>
        <AppCard variant="outlined" style={styles.section}>
          <SectionHeader title={t('farha.phase1.settings.proStatus')} />
          <AppText variant="body2" align="auto">
            {ctrl.isPro ? t('farha.phase1.settings.proActive') : t('farha.phase1.settings.proFree')}
          </AppText>
          <AppButton
            label={ctrl.isPro ? t('farha.phase1.actions.restorePurchase') : t('farha.phase1.actions.upgrade')}
            onPress={ctrl.openPro}
            fullWidth
          />
        </AppCard>
        <AppCard variant="outlined" style={styles.section}>
          <SectionHeader title={t('farha.phase1.settings.about')} />
          <AppText variant="body2" align="auto">{t('farha.phase1.settings.version')}</AppText>
        </AppCard>
        <AppButton
          label={t('farha.phase1.actions.clearAllData')}
          variant="danger"
          onPress={ctrl.clearAllData}
          fullWidth
        />
      </ScrollView>
    </AppScreenTemplate>
  );
}
