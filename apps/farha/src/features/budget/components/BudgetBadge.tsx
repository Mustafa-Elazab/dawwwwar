import React from 'react';
import { useTranslation } from '@dawwar/i18n';
import { AppBadge } from '@dawwar/ui';

import type { BudgetTotals } from '../../planner/domain/phase1Types';

export function BudgetBadge({ totals }: { totals: BudgetTotals }) {
  const { t } = useTranslation();

  return (
    <AppBadge
      label={t(
        totals.badge === 'over'
          ? 'farha.phase1.budget.overBudget'
          : 'farha.phase1.budget.onBudget',
      )}
      variant={totals.badge === 'over' ? 'warning' : 'success'}
    />
  );
}
