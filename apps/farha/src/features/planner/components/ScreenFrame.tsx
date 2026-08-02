import React, { useMemo } from 'react';
import { I18nManager, ScrollView, View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppIcon, AppPressable, AppScreenTemplate, AppText } from '@dawwar/ui';

import { usePlannerController } from '../context/PlannerControllerContext';
import { createPhase1ScreenStyles } from '../utils/styles';
import { BottomTabs } from './BottomTabs';

interface ScreenFrameProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  showBack?: boolean;
  showTabs?: boolean;
  headerActions?: React.ReactNode;
}

export function ScreenFrame({
  title,
  subtitle,
  children,
  showBack,
  showTabs,
  headerActions,
}: ScreenFrameProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createPhase1ScreenStyles(colors), [colors]);
  const controller = usePlannerController();

  return (
    <AppScreenTemplate
      contentStyle={styles.screenContent}
      isLoading={controller.status === 'loading'}
      isError={controller.status === 'error'}
      errorMessage={controller.errorMessageKey ? t(controller.errorMessageKey) : undefined}
      onRetry={controller.reload}
      footer={showTabs ? <BottomTabs /> : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.titleRow}>
            {showBack && controller.canGoBack ? (
              <AppPressable
                accessibilityRole="button"
                accessibilityLabel={t('farha.phase1.actions.back')}
                style={styles.backButton}
                onPress={controller.goBack}
              >
                <AppIcon
                  name={I18nManager.isRTL ? 'chevron-right' : 'chevron-left'}
                  size={26}
                  color={colors.text}
                />
              </AppPressable>
            ) : null}
            <View style={styles.rowText}>
              <AppText variant="h2" align="auto">{title}</AppText>
              {subtitle ? (
                <AppText variant="body2" color={colors.textSecondary} align="auto">
                  {subtitle}
                </AppText>
              ) : null}
            </View>
          </View>
          {headerActions}
        </View>
        {children}
      </ScrollView>
    </AppScreenTemplate>
  );
}
