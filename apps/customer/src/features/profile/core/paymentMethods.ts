import { storage, StorageKeys } from '../../../core/storage/mmkv';
import { PaymentMethod } from '@dawwar/types';

export type PaymentMethodKind =
  | 'cash'
  | 'wallet'
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
  supported?: boolean;
}

export const DEFAULT_PAYMENT_METHODS: SavedPaymentMethod[] = [
  { id: 'cash', kind: 'cash', label: 'paymentMethods.cash', supported: true },
  { id: 'wallet', kind: 'wallet', label: 'paymentMethods.wallet', supported: false },
  { id: 'google_pay', kind: 'google_pay', label: 'paymentMethods.google_pay', supported: false },
  { id: 'apple_pay', kind: 'apple_pay', label: 'paymentMethods.apple_pay', supported: false },
  { id: 'instapay', kind: 'instapay', label: 'paymentMethods.instapay', supported: false },
  { id: 'vodafone_cash', kind: 'vodafone_cash', label: 'paymentMethods.vodafone_cash', supported: false },
];

export const SUPPORTED_PAYMENT_METHOD_IDS = ['cash'] as const;

export type SupportedPaymentMethodId = typeof SUPPORTED_PAYMENT_METHOD_IDS[number];

export function isSupportedPaymentMethod(id: string): id is SupportedPaymentMethodId {
  return (SUPPORTED_PAYMENT_METHOD_IDS as readonly string[]).includes(id);
}

export function toOrderPaymentMethod(id?: string): PaymentMethod {
  return PaymentMethod.CASH;
}

export function getPaymentMethodLabelKey(id?: string) {
  const method = [...DEFAULT_PAYMENT_METHODS, ...readSavedPaymentMethods()].find(
    (candidate) => candidate.id === id,
  );
  return method?.label ?? 'paymentMethods.cash';
}

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
  const next = [{ ...card, kind: 'card' as const, label: 'paymentMethods.card', supported: false }, ...cards];
  writeSavedPaymentMethods(next);
}

export function readSelectedPaymentMethod() {
  const selected = storage.getString(StorageKeys.SELECTED_PAYMENT_METHOD) ?? 'cash';
  return isSupportedPaymentMethod(selected) ? selected : 'cash';
}

export function writeSelectedPaymentMethod(id: string) {
  if (!isSupportedPaymentMethod(id)) return;
  storage.set(StorageKeys.SELECTED_PAYMENT_METHOD, id);
}
