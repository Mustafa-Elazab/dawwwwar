import { useMemo, useState } from 'react';

import {
  calculateItemBalance,
  parseCurrencyInput,
} from '../../../../core/planner/domain/phase1Logic';
import { usePlannerController } from '../../../../core/planner/context/PlannerControllerContext';
import type { SavingsAllocationInput } from '../../../../core/planner/domain/phase1Types';

export function useController() {
  const appController = usePlannerController();
  const event = appController.getEventById(appController.route.params?.eventId);
  const summary = useMemo(
    () => appController.getSavingsSummary(event?.id),
    [appController, event?.id],
  );
  const items = useMemo(
    () => appController.getAllocatableBudgetItems(event?.id),
    [appController, event?.id],
  );
  const [allocationInputs, setAllocationInputs] = useState<Record<string, string>>({});

  const allocations = useMemo<SavingsAllocationInput[]>(() => {
    let remainingFund = summary.balance;

    return items.flatMap((item) => {
      const parsed = parseCurrencyInput(allocationInputs[item.id]) ?? 0;
      const amount = Math.min(parsed, calculateItemBalance(item), remainingFund);
      remainingFund -= amount;
      return amount > 0 ? [{ budgetItemId: item.id, amount }] : [];
    });
  }, [allocationInputs, items, summary.balance]);
  const totalAllocation = allocations.reduce((total, item) => total + item.amount, 0);

  const setAllocation = (budgetItemId: string, value: string) => {
    setAllocationInputs((current) => ({ ...current, [budgetItemId]: value }));
  };

  const suggestAllocation = () => {
    if (!event) return;

    const suggested = appController.suggestSavingsAllocations(event.id).reduce<Record<string, string>>(
      (draft, allocation) => ({
        ...draft,
        [allocation.budgetItemId]: String(allocation.amount),
      }),
      {},
    );
    setAllocationInputs(suggested);
  };

  const confirmAllocation = () => {
    if (!event || !allocations.length) return;
    appController.confirmSavingsAllocations(event.id, allocations);
  };

  return {
    event,
    summary,
    items,
    allocationInputs,
    totalAllocation,
    setAllocation,
    suggestAllocation,
    confirmAllocation,
    getItemBalance: calculateItemBalance,
  };
}
