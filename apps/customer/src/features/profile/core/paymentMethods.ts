import { storage, StorageKeys } from '../../../core/storage/mmkv';

export type PaymentMethodKind =
  | 'cash'
  | 'google_pay'
  | 'apple_pay'
  | 'instapay'
  | 'vodafone_cash'
  | 'card';

export interface SavedPaymentMethod {
  id: string;
  kind: PaymentMethodKind;
  label: string;
  masked?: string;
  holderName?: string;
  expiry?: string;
}

export const DEFAULT_PAYMENT_METHODS: SavedPaymentMethod[] = [
  { id: 'cash', kind: 'cash', label: 'payment_methods.cash' },
  { id: 'google_pay', kind: 'google_pay', label: 'payment_methods.google_pay' },
  { id: 'apple_pay', kind: 'apple_pay', label: 'payment_methods.apple_pay' },
  { id: 'instapay', kind: 'instapay', label: 'payment_methods.instapay' },
  { id: 'vodafone_cash', kind: 'vodafone_cash', label: 'payment_methods.vodafone_cash' },
];

export function readSavedPaymentMethods(): SavedPaymentMethod[] {
  const raw = storage.getString(StorageKeys.PAYMENT_METHODS);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeSavedPaymentMethods(methods: SavedPaymentMethod[]) {
  storage.set(StorageKeys.PAYMENT_METHODS, JSON.stringify(methods));
}

export function addSavedCard(card: Omit<SavedPaymentMethod, 'kind' | 'label'>) {
  const cards = readSavedPaymentMethods();
  const next = [{ ...card, kind: 'card' as const, label: 'payment_methods.card' }, ...cards];
  writeSavedPaymentMethods(next);
  storage.set(StorageKeys.SELECTED_PAYMENT_METHOD, card.id);
}

export function readSelectedPaymentMethod() {
  return storage.getString(StorageKeys.SELECTED_PAYMENT_METHOD) ?? 'cash';
}

export function writeSelectedPaymentMethod(id: string) {
  storage.set(StorageKeys.SELECTED_PAYMENT_METHOD, id);
}
