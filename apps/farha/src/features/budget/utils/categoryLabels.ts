import type { FarhaPhase1BudgetCategory } from '../../planner/domain/phase1Types';
import type { Phase1TranslationFn } from '../../planner/types/screenTypes';

export const getCategoryName = (
  t: Phase1TranslationFn,
  category: FarhaPhase1BudgetCategory,
): string =>
  category.customName ??
  (category.nameKey ? t(category.nameKey) : t('farha.phase1.categories.other'));
