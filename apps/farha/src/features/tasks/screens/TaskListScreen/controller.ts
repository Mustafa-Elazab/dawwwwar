import { useMemo, useState } from 'react';

import {
  calculateBudgetTotals,
  getTaskSummary,
} from '../../../../core/planner/domain/phase1Logic';
import type { FarhaPhase1Task } from '../../../../core/planner/domain/phase1Types';
import { usePlannerController } from '../../../../core/planner/context/PlannerControllerContext';
import { getScreenEvent } from '../../../planner/utils/helpers';

export type TaskGrouping = 'category' | 'dueDate';

export interface TaskGroup {
  key: string;
  titleKey?: string;
  title: string;
  tasks: FarhaPhase1Task[];
}

export function useController() {
  const appController = usePlannerController();
  const event = getScreenEvent(appController);
  const [grouping, setGrouping] = useState<TaskGrouping>('dueDate');
  const [paymentTaskId, setPaymentTaskId] = useState<string | undefined>();
  const [paymentAmount, setPaymentAmount] = useState('');
  const [celebratingTaskId, setCelebratingTaskId] = useState<string | undefined>();
  const tasks = useMemo(
    () => appController.getEventTasks(event?.id),
    [appController, event?.id],
  );
  const summary = useMemo(() => getTaskSummary(tasks), [tasks]);
  const totals = useMemo(() => calculateBudgetTotals(tasks), [tasks]);
  const groups = useMemo(
    () => groupTasks(tasks, grouping),
    [grouping, tasks],
  );
  const paymentTask = useMemo(
    () => tasks.find((task) => task.id === paymentTaskId),
    [paymentTaskId, tasks],
  );

  const markDone = (taskId: string) => {
    appController.setTaskStatus(taskId, 'done');
    setCelebratingTaskId(taskId);
    setTimeout(() => setCelebratingTaskId(undefined), 700);
  };

  const openPayment = (task: FarhaPhase1Task) => {
    setPaymentTaskId(task.id);
    setPaymentAmount(String(task.paymentPlan?.monthlyAmount ?? ''));
  };

  const logPayment = () => {
    if (!paymentTask) return;
    const amount = Number(paymentAmount.replace(/,/g, '').trim());
    if (!Number.isFinite(amount) || amount <= 0) return;
    appController.logTaskPayment({ taskId: paymentTask.id, amount });
    setPaymentTaskId(undefined);
    setPaymentAmount('');
  };

  return {
    event,
    tasks,
    groups,
    grouping,
    summary,
    totals,
    isPro: appController.state.isPro,
    paymentTask,
    paymentAmount,
    celebratingTaskId,
    setGrouping,
    setPaymentAmount,
    addTask: () => event && appController.navigate('TaskFormScreen', { occasionId: event.id }),
    editTask: (taskId: string) => event && appController.navigate('TaskFormScreen', { occasionId: event.id, taskId }),
    markDone,
    openPayment,
    cancelPayment: () => setPaymentTaskId(undefined),
    logPayment,
  };
}

const groupTasks = (tasks: FarhaPhase1Task[], grouping: TaskGrouping): TaskGroup[] => {
  const buckets = new Map<string, FarhaPhase1Task[]>();
  tasks.forEach((task) => {
    const key = grouping === 'category'
      ? task.category ?? task.customCategory ?? 'none'
      : task.dueDate ?? 'none';
    buckets.set(key, [...(buckets.get(key) ?? []), task]);
  });

  return Array.from(buckets.entries()).map(([key, groupTasks]) => ({
    key,
    titleKey: grouping === 'category' && key !== 'none' && !groupTasks[0].customCategory
      ? `farha.phase1.categories.${key}`
      : undefined,
    title: key,
    tasks: groupTasks,
  }));
};
