import React from 'react';
import {
  I18nManager,
  Modal,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { spacing } from '@dawwar/theme';
import { useTheme } from '@dawwar/theme';
import { AppButton, AppText } from '@dawwar/ui';

import { usePlannerController } from '../../../core/planner/context/PlannerControllerContext';
import type {
  FarhaPhase1WalkthroughStep,
  Phase1ScreenName,
} from '../../../core/planner/domain/phase1Types';

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface StepConfig {
  routeName: Phase1ScreenName;
  titleKey: string;
  bodyKey: string;
  primaryLabelKey: string;
}

const STEP_CONFIG: Record<Exclude<FarhaPhase1WalkthroughStep, 'completed'>, StepConfig> = {
  createEvent: {
    routeName: 'OccasionCreateScreen',
    titleKey: 'farha.phase1.walkthrough.createEvent.title',
    bodyKey: 'farha.phase1.walkthrough.createEvent.body',
    primaryLabelKey: 'farha.phase1.walkthrough.next',
  },
  eventCategories: {
    routeName: 'OccasionCreateScreen',
    titleKey: 'farha.phase1.walkthrough.eventCategories.title',
    bodyKey: 'farha.phase1.walkthrough.eventCategories.body',
    primaryLabelKey: 'farha.phase1.walkthrough.next',
  },
  eventBudget: {
    routeName: 'OccasionCreateScreen',
    titleKey: 'farha.phase1.walkthrough.eventBudget.title',
    bodyKey: 'farha.phase1.walkthrough.eventBudget.body',
    primaryLabelKey: 'farha.phase1.walkthrough.gotIt',
  },
  dashboardOverview: {
    routeName: 'OccasionDashboardScreen',
    titleKey: 'farha.phase1.walkthrough.dashboardOverview.title',
    bodyKey: 'farha.phase1.walkthrough.dashboardOverview.body',
    primaryLabelKey: 'farha.phase1.walkthrough.next',
  },
  tasksTab: {
    routeName: 'OccasionDashboardScreen',
    titleKey: 'farha.phase1.walkthrough.tasksTab.title',
    bodyKey: 'farha.phase1.walkthrough.tasksTab.body',
    primaryLabelKey: 'farha.phase1.walkthrough.openTasks',
  },
  addTask: {
    routeName: 'TaskListScreen',
    titleKey: 'farha.phase1.walkthrough.addTask.title',
    bodyKey: 'farha.phase1.walkthrough.addTask.body',
    primaryLabelKey: 'farha.phase1.walkthrough.openTaskForm',
  },
  taskForm: {
    routeName: 'TaskFormScreen',
    titleKey: 'farha.phase1.walkthrough.taskForm.title',
    bodyKey: 'farha.phase1.walkthrough.taskForm.body',
    primaryLabelKey: 'farha.phase1.walkthrough.finish',
  },
};

const TOOLTIP_WIDTH_PADDING = spacing[4];
const TOOLTIP_HEIGHT = 214;

export function AppWalkthroughGuide() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const controller = usePlannerController();
  const step = getVisibleStep(controller.walkthroughStep, controller.route.name);

  if (!step || controller.status !== 'ready') return null;

  const config = STEP_CONFIG[step];
  const target = getTargetRect(step, width, height);
  const targetCenter = target.left + target.width / 2;
  const isTooltipAboveTarget = target.top > height * 0.52;
  const tooltipTop = isTooltipAboveTarget
    ? Math.max(spacing[5], target.top - TOOLTIP_HEIGHT - spacing[4])
    : Math.min(height - TOOLTIP_HEIGHT - spacing[5], target.top + target.height + spacing[4]);
  const pointerOffset = clamp(targetCenter - TOOLTIP_WIDTH_PADDING - 12, 18, width - (TOOLTIP_WIDTH_PADDING * 2) - 48);

  const handlePrimary = () => {
    if (step === 'tasksTab') {
      controller.setWalkthroughStep('addTask');
      controller.openTab('tasks');
      return;
    }

    if (step === 'addTask') {
      if (!controller.activeEvent) {
        controller.skipWalkthrough();
        return;
      }
      controller.setWalkthroughStep('taskForm');
      controller.navigate('TaskFormScreen', { occasionId: controller.activeEvent.id });
      return;
    }

    if (step === 'taskForm') {
      controller.skipWalkthrough();
      return;
    }

    controller.advanceWalkthrough();
  };

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={controller.skipWalkthrough}
    >
      <View
        style={[
          styles.backdrop,
          {
            backgroundColor: colors.overlay,
          },
        ]}
      >
        <View
          pointerEvents="none"
          style={[
            styles.highlight,
            {
              top: target.top,
              left: target.left,
              width: target.width,
              height: target.height,
              borderColor: colors.primaryText,
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
            },
          ]}
        />
        <View
          style={[
            styles.tooltipWrap,
            {
              top: tooltipTop,
              left: TOOLTIP_WIDTH_PADDING,
              right: TOOLTIP_WIDTH_PADDING,
            },
          ]}
        >
          {!isTooltipAboveTarget ? (
            <View
              style={[
                styles.pointerUp,
                {
                  marginStart: pointerOffset,
                  borderBottomColor: colors.card,
                },
              ]}
            />
          ) : null}
          <View
            accessible
            accessibilityLabel={t(config.titleKey)}
            style={[
              styles.tooltip,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.copy}>
              <AppText variant="h4" color={colors.text} align="auto">
                {t(config.titleKey)}
              </AppText>
              <AppText variant="body2" color={colors.textSecondary} align="auto">
                {t(config.bodyKey)}
              </AppText>
            </View>
            <View style={styles.actions}>
              <AppButton
                label={t('farha.phase1.walkthrough.skip')}
                size="sm"
                variant="outline"
                onPress={controller.skipWalkthrough}
              />
              <AppButton
                label={t(config.primaryLabelKey)}
                size="sm"
                onPress={handlePrimary}
              />
            </View>
          </View>
          {isTooltipAboveTarget ? (
            <View
              style={[
                styles.pointerDown,
                {
                  marginStart: pointerOffset,
                  borderTopColor: colors.card,
                },
              ]}
            />
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const getVisibleStep = (
  step: FarhaPhase1WalkthroughStep,
  routeName: Phase1ScreenName,
): Exclude<FarhaPhase1WalkthroughStep, 'completed'> | undefined => {
  if (step === 'completed') return undefined;
  const config = STEP_CONFIG[step];
  return config.routeName === routeName ? step : undefined;
};

const getTargetRect = (
  step: Exclude<FarhaPhase1WalkthroughStep, 'completed'>,
  width: number,
  height: number,
): TargetRect => {
  const horizontal = spacing[4];
  const contentWidth = width - horizontal * 2;

  switch (step) {
    case 'createEvent':
      return {
        top: Math.min(height - 142, Math.max(520, height * 0.72)),
        left: horizontal,
        width: contentWidth,
        height: 58,
      };
    case 'eventCategories':
      return {
        top: 260,
        left: horizontal,
        width: contentWidth,
        height: 94,
      };
    case 'eventBudget':
      return {
        top: 360,
        left: horizontal,
        width: contentWidth,
        height: 138,
      };
    case 'dashboardOverview':
      return {
        top: 152,
        left: horizontal,
        width: contentWidth,
        height: 142,
      };
    case 'tasksTab': {
      const tabWidth = width / 4;
      return {
        top: height - 96,
        left: I18nManager.isRTL ? width - tabWidth * 2 : tabWidth,
        width: tabWidth,
        height: 78,
      };
    }
    case 'addTask':
      return {
        top: Math.min(height - 170, 382),
        left: horizontal,
        width: contentWidth,
        height: 58,
      };
    case 'taskForm':
      return {
        top: 148,
        left: horizontal,
        width: contentWidth,
        height: 342,
      };
    default:
      return {
        top: 160,
        left: horizontal,
        width: contentWidth,
        height: 120,
      };
  }
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  highlight: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 18,
  },
  tooltipWrap: {
    position: 'absolute',
  },
  tooltip: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 18,
    padding: spacing[4],
    gap: spacing[4],
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  copy: {
    gap: spacing[2],
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  pointerUp: {
    width: 0,
    height: 0,
    borderStartWidth: 12,
    borderEndWidth: 12,
    borderBottomWidth: 16,
    borderStartColor: 'transparent',
    borderEndColor: 'transparent',
  },
  pointerDown: {
    width: 0,
    height: 0,
    borderStartWidth: 12,
    borderEndWidth: 12,
    borderTopWidth: 16,
    borderStartColor: 'transparent',
    borderEndColor: 'transparent',
  },
});
