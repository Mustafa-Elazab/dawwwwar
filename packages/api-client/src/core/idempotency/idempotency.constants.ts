export interface IdempotencyStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const IDEMPOTENT_ENDPOINTS = [
  '/orders',
  '/orders/custom',
  '/wallet/recharge',
  '/wallet/recharge/paymob',
  '/payouts/request',
  '/admin/payouts/:id/approve',
  '/auth/select-role',
  '/orders/:id/tip',
  '/orders/merchant/:id/accept',
  '/orders/driver/:id/accept',
];
