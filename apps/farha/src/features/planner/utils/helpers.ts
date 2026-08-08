import { Alert } from 'react-native';

import {
  formatCurrency,
  getCountdownDays,
} from '../../../core/planner/domain/phase1Logic';
import type { Phase1PlannerController } from '../../../core/planner/usePhase1Planner';
import type { FarhaPhase1Event } from '../../../core/planner/domain/phase1Types';
import type { Phase1TranslationFn } from '../../../core/planner/screenTypes';

export const getScreenEvent = (
  controller: Phase1PlannerController,
): FarhaPhase1Event | undefined =>
  controller.getEventById(controller.route.params?.occasionId ?? controller.route.params?.eventId) ??
  controller.activeEvent;

export const money = (t: Phase1TranslationFn, amount: number): string =>
  `${formatCurrency(amount)} ${t('farha.phase1.currency')}`;

export const formatCountdown = (
  t: Phase1TranslationFn,
  event: FarhaPhase1Event,
): string => {
  const days = getCountdownDays(event.date);
  if (days > 0) return t('farha.phase1.countdown.future', { count: days });
  if (days < 0) return t('farha.phase1.countdown.past', { count: Math.abs(days) });
  return t('farha.phase1.countdown.today');
};

export const confirmAction = (
  message: string,
  action: () => void,
  cancelLabel: string,
  okLabel: string,
) => {
  Alert.alert('Farha', message, [
    { text: cancelLabel, style: 'cancel' },
    { text: okLabel, style: 'destructive', onPress: action },
  ]);
};
