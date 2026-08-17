import React, { useMemo } from 'react';
import type { ScrollViewProps } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import type { AppScreenTemplateProps } from '@dawwar/ui';

import { usePlannerController } from '../../../core/planner/context/PlannerControllerContext';
import { CurvedHeader } from '../components/CurvedHeader';
import { createPhase1ScreenStyles } from '../utils/styles';

interface PlannerScreenChromeOptions {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showTabs?: boolean;
  headerActions?: React.ReactNode;
}

interface PlannerScreenChrome {
  templateProps: Pick<
    AppScreenTemplateProps,
    | 'contentStyle'
    | 'isLoading'
    | 'isError'
    | 'errorMessage'
    | 'onRetry'
    | 'header'
    | 'footer'
    | 'backgroundColor'
    | 'statusBarStyle'
    | 'statusBarBackgroundColor'
  >;
  scrollViewProps: Pick<
    ScrollViewProps,
    'contentContainerStyle' | 'keyboardShouldPersistTaps' | 'showsVerticalScrollIndicator'
  >;
}

export function usePlannerScreenChrome({
  title,
  subtitle,
  showBack,
  headerActions,
}: PlannerScreenChromeOptions): PlannerScreenChrome {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createPhase1ScreenStyles(colors), [colors]);
  const controller = usePlannerController();

  return {
    templateProps: {
      backgroundColor: colors.primary,
      statusBarStyle: 'light-content',
      statusBarBackgroundColor: colors.primary,
      contentStyle: styles.screenContent,
      isLoading: controller.status === 'loading',
      isError: controller.status === 'error',
      errorMessage: controller.errorMessageKey ? t(controller.errorMessageKey) : undefined,
      onRetry: controller.reload,
      header: (
        <CurvedHeader
          title={title}
          subtitle={subtitle}
          onBackPress={showBack ? controller.goBack : undefined}
          action={headerActions}
          tipTitle={t('farha.phase1.tips.title')}
          tipBody={t(`farha.phase1.tips.${getTipKey(controller.route.name)}`)}
          tipCloseLabel={t('farha.phase1.confirm.ok')}
        />
      ),
      footer: undefined,
    },
    scrollViewProps: {
      contentContainerStyle: styles.scrollContent,
      keyboardShouldPersistTaps: 'handled',
      showsVerticalScrollIndicator: false,
    },
  };
}

const getTipKey = (routeName: string): string => {
  if (routeName.includes('Create') || routeName.includes('Edit')) return 'create';
  if (routeName.includes('Task')) return 'tasks';
  if (routeName.includes('Share')) return 'share';
  if (routeName.includes('Settings')) return 'settings';
  return 'home';
};
