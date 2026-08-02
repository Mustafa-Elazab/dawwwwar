import React, { useMemo } from 'react';
import type { ScrollViewProps } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import type { AppScreenTemplateProps, HeaderProps } from '@dawwar/ui';

import { usePlannerController } from '../../../core/planner/context/PlannerControllerContext';
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
    | 'headerProps'
    | 'footer'
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

  const headerProps: HeaderProps = {
    title,
    subtitle,
    onBackPress: showBack ? controller.goBack : undefined,
    bottomComponent: headerActions,
  };

  return {
    templateProps: {
      contentStyle: styles.screenContent,
      isLoading: controller.status === 'loading',
      isError: controller.status === 'error',
      errorMessage: controller.errorMessageKey ? t(controller.errorMessageKey) : undefined,
      onRetry: controller.reload,
      headerProps,
      footer: undefined,
    },
    scrollViewProps: {
      contentContainerStyle: styles.scrollContent,
      keyboardShouldPersistTaps: 'handled',
      showsVerticalScrollIndicator: false,
    },
  };
}
