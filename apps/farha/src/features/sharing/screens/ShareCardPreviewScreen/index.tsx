import React, { useMemo } from 'react';
import { ImageBackground, ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppButton, AppScreenTemplate, AppText } from '@dawwar/ui';

import { BudgetBadge } from '../../../budget/components';
import { usePlannerScreenChrome } from '../../../planner/hooks/usePlannerScreenChrome';
import { MissingEventState } from '../../../planner/states/MissingEventState';
import { formatCountdown, money } from '../../../planner/utils/helpers';
import { useController } from './controller';
import { createStyles } from './styles';

export function ShareCardPreviewScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();
  const screen = usePlannerScreenChrome({
    title: t('farha.phase1.share.title'),
    subtitle: t('farha.phase1.share.subtitle'),
    showTabs: true,
  });

  if (!ctrl.event) return <MissingEventState />;

  return (
    <AppScreenTemplate {...screen.templateProps}>
      <ScrollView {...screen.scrollViewProps}>
        {ctrl.event.coverPhotoUri ? (
          <ImageBackground
            source={{ uri: ctrl.event.coverPhotoUri }}
            imageStyle={styles.previewImage}
            style={styles.previewCard}
          >
            <SharePreviewContent
              title={ctrl.event.title}
              dateLine={`${ctrl.event.date} - ${formatCountdown(t, ctrl.event)}`}
              planned={money(t, ctrl.totals.plannedTotal)}
              actual={money(t, ctrl.totals.actualTotal)}
              progress={t('farha.phase1.checklist.progress', {
                done: ctrl.summary.doneCount,
                total: ctrl.summary.actionableTotal,
              })}
              madeWith={t('farha.phase1.share.madeWith')}
              metricColor={colors.primaryText}
              secondaryColor={colors.primaryText}
              metricBackground="rgba(255, 255, 255, 0.18)"
              contentStyle={styles.previewOverlay}
              totals={ctrl.totals}
            />
          </ImageBackground>
        ) : (
          <View style={[styles.previewCard, styles.previewCardFallback]}>
            <SharePreviewContent
              title={ctrl.event.title}
              dateLine={`${ctrl.event.date} - ${formatCountdown(t, ctrl.event)}`}
              planned={money(t, ctrl.totals.plannedTotal)}
              actual={money(t, ctrl.totals.actualTotal)}
              progress={t('farha.phase1.checklist.progress', {
                done: ctrl.summary.doneCount,
                total: ctrl.summary.actionableTotal,
              })}
              madeWith={t('farha.phase1.share.madeWith')}
              metricColor={colors.text}
              secondaryColor={colors.textSecondary}
              metricBackground={colors.surfaceVariant}
              totals={ctrl.totals}
            />
          </View>
        )}
        <AppButton label={t('farha.phase1.actions.share')} onPress={ctrl.share} fullWidth />
        <AppButton label={t('farha.phase1.actions.saveImage')} variant="outline" disabled fullWidth />
        <AppText variant="caption" color={colors.textSecondary} align="center" style={styles.disabledHint}>
          {t('farha.phase1.share.saveImageUnavailable')}
        </AppText>
      </ScrollView>
    </AppScreenTemplate>
  );
}

function SharePreviewContent({
  title,
  dateLine,
  planned,
  actual,
  progress,
  madeWith,
  metricColor,
  secondaryColor,
  metricBackground,
  contentStyle,
  totals,
}: {
  title: string;
  dateLine: string;
  planned: string;
  actual: string;
  progress: string;
  madeWith: string;
  metricColor: string;
  secondaryColor: string;
  metricBackground: string;
  contentStyle?: StyleProp<ViewStyle>;
  totals: React.ComponentProps<typeof BudgetBadge>['totals'];
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.previewContent, contentStyle]}>
      <View style={styles.previewTop}>
        <AppText color={metricColor} align="auto" numberOfLines={2} style={styles.previewTitle}>
          {title}
        </AppText>
        <AppText variant="body2" color={secondaryColor} align="auto">
          {dateLine}
        </AppText>
      </View>
      <View style={styles.previewMetrics}>
        <View style={[styles.previewMetric, { backgroundColor: metricBackground }]}>
          <AppText variant="caption" color={secondaryColor} align="auto">
            {t('farha.phase1.labels.planned')}
          </AppText>
          <AppText variant="h3" color={metricColor} align="auto" numberOfLines={1}>
            {planned}
          </AppText>
        </View>
        <View style={[styles.previewMetric, { backgroundColor: metricBackground }]}>
          <AppText variant="caption" color={secondaryColor} align="auto">
            {t('farha.phase1.labels.actual')}
          </AppText>
          <AppText variant="h3" color={metricColor} align="auto" numberOfLines={1}>
            {actual}
          </AppText>
        </View>
        <View style={[styles.previewMetric, { backgroundColor: metricBackground }]}>
          <AppText variant="caption" color={secondaryColor} align="auto">
            {t('farha.phase1.share.tasks')}
          </AppText>
          <AppText variant="h4" color={metricColor} align="auto">
            {progress}
          </AppText>
        </View>
      </View>
      <View style={styles.previewFooter}>
        <BudgetBadge totals={totals} />
        <AppText variant="caption" color={secondaryColor} align="auto">
          {madeWith}
        </AppText>
      </View>
    </View>
  );
}
