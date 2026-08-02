import type { FarhaPhase1Event, FarhaPhase1EventType } from '../../../core/planner/domain/phase1Types';

export interface EventFormState {
  type: FarhaPhase1EventType;
  title: string;
  date: string;
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
};

export const eventToForm = (event?: FarhaPhase1Event): EventFormState => {
  if (!event) return defaultEventForm;
  return { type: event.type, title: event.title, date: event.date };
};
