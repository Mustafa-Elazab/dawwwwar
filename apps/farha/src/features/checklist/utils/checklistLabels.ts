import type { FarhaPhase1ChecklistItem } from '../../../core/planner/domain/phase1Types';
import type { Phase1TranslationFn } from '../../../core/planner/screenTypes';

export const getChecklistTitle = (
  t: Phase1TranslationFn,
  item: FarhaPhase1ChecklistItem,
): string =>
  item.titleKey ? t(item.titleKey) : item.title;
