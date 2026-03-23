import type { OpeningHours } from '@dawwar/types';

const DAY_NAMES = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

export type DayName = (typeof DAY_NAMES)[number];

export const ALL_DAYS = DAY_NAMES;

export function getTodayHours(
  hours: OpeningHours,
): { open: string; close: string } | null {
  const dayIndex = new Date().getDay();
  const dayName = DAY_NAMES[dayIndex] as keyof OpeningHours;
  return hours[dayName] ?? null;
}

export function formatHours(
  hours: { open: string; close: string } | null | undefined,
): string {
  if (!hours) return 'Closed';
  return `${hours.open} – ${hours.close}`;
}
