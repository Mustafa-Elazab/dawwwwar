import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppButton, AppScreenTemplate, AppText } from '@dawwar/ui';

import type { Phase1PlannerController } from '../hooks/usePhase1Planner';
import { createPhase1ScreenStyles } from '../utils/styles';
import { BottomTabs } from './BottomTabs';

interface ScreenFrameProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  controller?: Phase1PlannerController;
  showBack?: boolean;
  showTabs?: boolean;
  headerActions?: React.ReactNode;
}

export function ScreenFrame({
  title,
  subtitle,
  children,
  controller,
  showBack,
  showTabs,
  headerActions,
}: ScreenFrameProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createPhase1ScreenStyles(colors), [colors]);

  return (
    <AppScreenTemplate
      contentStyle={styles.screenContent}
      isLoading={controller?.status === 'loading'}
      isError={controller?.status === 'error'}
      errorMessage={controller?.errorMessageKey ? t(controller.errorMessageKey) : undefined}
      onRetry={controller?.reload}
      footer={showTabs && controller ? <BottomTabs controller={controller} /> : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={styles.rowText}>
              <AppText variant="h2" align="auto">{title}</AppText>
              {subtitle ? (
                <AppText variant="body2" color={colors.textSecondary} align="auto">
                  {subtitle}
                </AppText>
              ) : null}
            </View>
            {showBack && controller ? (
              <AppButton
                label={t('farha.phase1.actions.back')}
                size="sm"
                variant="outline"
                onPress={controller.goBack}
              />
            ) : null}
          </View>
          {headerActions}
        </View>
        {children}
      </ScrollView>
    </AppScreenTemplate>
  );
}
