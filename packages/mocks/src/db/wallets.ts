import { TransactionType, TransactionReason } from '@dawwar/types';
import type { Wallet, WalletTransaction } from '@dawwar/types';

export const mockWallets: Wallet[] = [
  { id: 'wallet-c1', userId: 'user-customer-01', balance: 200, currency: 'EGP', isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'wallet-c2', userId: 'user-customer-02', balance: 50, currency: 'EGP', isActive: true, createdAt: '2024-01-02T00:00:00Z', updatedAt: '2024-01-02T00:00:00Z' },
  { id: 'wallet-m1', userId: 'user-merchant-01', balance: 100, currency: 'EGP', isActive: true, createdAt: '2024-01-03T00:00:00Z', updatedAt: '2024-01-03T00:00:00Z' },
  { id: 'wallet-m2', userId: 'user-merchant-02', balance: 75, currency: 'EGP', isActive: true, createdAt: '2024-01-04T00:00:00Z', updatedAt: '2024-01-04T00:00:00Z' },
  { id: 'wallet-m3', userId: 'user-merchant-03', balance: 30, currency: 'EGP', isActive: true, createdAt: '2024-01-05T00:00:00Z', updatedAt: '2024-01-05T00:00:00Z' },
  { id: 'wallet-d1', userId: 'user-driver-01', balance: 50, currency: 'EGP', isActive: true, createdAt: '2024-01-06T00:00:00Z', updatedAt: '2024-01-06T00:00:00Z' },
  { id: 'wallet-d2', userId: 'user-driver-02', balance: 20, currency: 'EGP', isActive: true, createdAt: '2024-01-07T00:00:00Z', updatedAt: '2024-01-07T00:00:00Z' },
];

export const mockTransactions: WalletTransaction[] = [
  {
    id: 'tx-001',
    walletId: 'wallet-c1',
    type: TransactionType.DEBIT,
    amount: 95,
    reason: TransactionReason.ORDER_PAYMENT,
    orderId: 'order-001',
    description: 'Payment for order ORD-10001',
    balanceBefore: 295,
    balanceAfter: 200,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'tx-002',
    walletId: 'wallet-c1',
    type: TransactionType.CREDIT,
    amount: 100,
    reason: TransactionReason.WALLET_RECHARGE,
    description: 'Wallet recharge',
    balanceBefore: 195,
    balanceAfter: 295,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'tx-003',
    walletId: 'wallet-m1',
    type: TransactionType.DEBIT,
    amount: 5,
    reason: TransactionReason.COMMISSION_DEDUCTION,
    orderId: 'order-001',
    description: 'Commission for order ORD-10001',
    balanceBefore: 105,
    balanceAfter: 100,
    createdAt: new Date(Date.now() - 82800000).toISOString(),
  },
  {
    id: 'tx-004',
    walletId: 'wallet-d1',
    type: TransactionType.DEBIT,
    amount: 5,
    reason: TransactionReason.COMMISSION_DEDUCTION,
    orderId: 'order-001',
    description: 'Commission for order ORD-10001',
    balanceBefore: 55,
    balanceAfter: 50,
    createdAt: new Date(Date.now() - 82800000).toISOString(),
  },
];

export const getWalletByUser = (userId: string): Wallet | undefined =>
  mockWallets.find((w) => w.userId === userId);

export const getTransactionsByUser = (userId: string): WalletTransaction[] => {
  const wallet = mockWallets.find((w) => w.userId === userId);
  if (!wallet) return [];
  return mockTransactions.filter((t) => t.walletId === wallet.id);
};
