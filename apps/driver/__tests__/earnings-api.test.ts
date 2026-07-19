import { earningsApi } from '../src/features/earnings/core/api';
import api from '../src/core/api/client';

jest.mock('../src/core/api/client', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

const mockedApi = api as { get: jest.Mock };

describe('driver earnings API', () => {
  beforeEach(() => {
    mockedApi.get.mockReset();
  });

  it('requests driver earnings from the authenticated driver endpoint', async () => {
    const summary = {
      todayDeliveries: 1,
      todayGross: 17,
      todayCommission: 5,
      todayNet: 12,
      weeklyData: [],
    };
    mockedApi.get.mockResolvedValueOnce({ data: summary });

    await expect(earningsApi.getSummary()).resolves.toBe(summary);
    expect(mockedApi.get).toHaveBeenCalledWith('/driver/earnings');
  });

  it('requests driver transactions without a stale driverId query string', async () => {
    const transactions = [{ id: 'tx-driver-1' }];
    mockedApi.get.mockResolvedValueOnce({ data: transactions });

    await expect(earningsApi.getTransactions()).resolves.toBe(transactions);
    expect(mockedApi.get).toHaveBeenCalledWith('/driver/transactions');
  });

  it('requests driver wallet balance from the authenticated driver endpoint', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: 120 });

    await expect(earningsApi.getWalletBalance()).resolves.toBe(120);
    expect(mockedApi.get).toHaveBeenCalledWith('/driver/wallet');
  });
});
