import React from 'react';
import { useTranslation } from '@dawwar/i18n';
import { StepIndicator } from '@dawwar/ui';
import { OrderStatus, OrderType } from '@dawwar/types';
import type { StatusTimelineProps } from './types';

const REGULAR_STEPS: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.ACCEPTED,
  OrderStatus.DRIVER_ASSIGNED,
  OrderStatus.PICKED_UP,
  OrderStatus.IN_TRANSIT,
  OrderStatus.DELIVERED,
];

const CUSTOM_STEPS: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.DRIVER_ASSIGNED,
  OrderStatus.AT_SHOP,
  OrderStatus.SHOPPING,
  OrderStatus.PURCHASED,
  OrderStatus.DELIVERED,
];

function getStepIndex(status: OrderStatus, isCustom: boolean): number {
  const steps = isCustom ? CUSTOM_STEPS : REGULAR_STEPS;
  const idx = steps.indexOf(status);
  return idx === -1 ? 0 : idx;
}

export function StatusTimeline({ status, orderType }: StatusTimelineProps) {
  const { t } = useTranslation();
  const isCustom = orderType === OrderType.CUSTOM;

  const stepLabels = isCustom
    ? [
        t('tracking.status.PENDING'),
        t('tracking.status.DRIVER_ASSIGNED'),
        t('tracking.status.AT_SHOP'),
        t('tracking.status.SHOPPING'),
        t('tracking.status.PURCHASED'),
        t('tracking.status.DELIVERED'),
      ]
    : [
        t('tracking.status.PENDING'),
        t('tracking.status.ACCEPTED'),
        t('tracking.status.DRIVER_ASSIGNED'),
        t('tracking.status.PICKED_UP'),
        t('tracking.status.IN_TRANSIT'),
        t('tracking.status.DELIVERED'),
      ];

  const currentStep = getStepIndex(status, isCustom);

  return <StepIndicator steps={stepLabels} currentStep={currentStep} />;
}
