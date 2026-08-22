import {
  phase1TaskCategories,
} from '../../../core/planner/domain/phase1Logic';
import type {
  FarhaPhase1Event,
  FarhaPhase1EventType,
  FarhaPhase1TaskCategoryKey,
} from '../../../core/planner/domain/phase1Types';

export interface EventFormState {
  type: FarhaPhase1EventType;
  title: string;
  date: string;
  categoryKeys: FarhaPhase1TaskCategoryKey[];
  budgetSpent: number;
  budgetAvailable: number;
  budgetTarget: number;
  coverPhotoUri?: string;
}

export const getDefaultFutureDate = (): string => {
  const date = new Date();
  date.setMonth(date.getMonth() + 6);
  return date.toISOString().slice(0, 10);
};

export const defaultEventForm: EventFormState = {
  type: 'wedding',
  title: '',
  date: getDefaultFutureDate(),
  categoryKeys: phase1TaskCategories,
  budgetSpent: 0,
  budgetAvailable: 0,
  budgetTarget: 0,
};

export const eventToForm = (event?: FarhaPhase1Event): EventFormState => {
  if (!event) return defaultEventForm;
  return {
    type: event.type,
    title: event.title,
    date: event.date,
    categoryKeys: event.categoryKeys?.length ? event.categoryKeys : phase1TaskCategories,
    budgetSpent: event.budgetSpent,
    budgetAvailable: event.budgetAvailable,
    budgetTarget: event.budgetTarget,
    coverPhotoUri: event.coverPhotoUri,
  };
};
