import type { Phase1TranslationFn } from '../../../core/planner/screenTypes';
import type { FarhaPhase1Task } from '../../../core/planner/domain/phase1Types';

export const getTaskTitle = (t: Phase1TranslationFn, task: FarhaPhase1Task): string =>
  task.titleKey ? t(task.titleKey) : task.title;

export const getTaskCategoryLabel = (t: Phase1TranslationFn, task: FarhaPhase1Task): string =>
  task.customCategory ??
  (task.category ? t(`farha.phase1.categories.${task.category}`) : t('farha.phase1.labels.none'));
