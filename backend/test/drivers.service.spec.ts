import { describe, expect, it, jest } from '@jest/globals';
import { DriversService } from '../src/modules/drivers/drivers.service';

describe('DriversService', () => {
  const createService = () => {
    const driverRepo = {
      findOne: jest.fn(),
      update: jest.fn(),
      query: jest.fn(),
      find: jest.fn(),
      createQueryBuilder: jest.fn(),
    };
    const walletRepo = {
      findOne: jest.fn(),
    };
    const txRepo = {
      find: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const service = new DriversService(
      driverRepo as never,
      walletRepo as never,
      txRepo as never,
    );

    return { service, walletRepo, txRepo };
  };

  it('returns the authenticated driver wallet transactions newest first', async () => {
    const { service, walletRepo, txRepo } = createService();
    const wallet = { id: 'wallet-driver-1', userId: 'driver-user-1' };
    const transactions = [
      { id: 'tx-new', walletId: wallet.id },
      { id: 'tx-old', walletId: wallet.id },
    ];

    walletRepo.findOne.mockResolvedValue(wallet as never);
    txRepo.find.mockResolvedValue(transactions as never);

    await expect(service.getTransactions(wallet.userId)).resolves.toBe(transactions);
    expect(walletRepo.findOne).toHaveBeenCalledWith({ where: { userId: wallet.userId } });
    expect(txRepo.find).toHaveBeenCalledWith({
      where: { walletId: wallet.id },
      order: { createdAt: 'DESC' },
      take: 100,
    });
  });

  it('returns an empty transaction list when the driver wallet does not exist yet', async () => {
    const { service, walletRepo, txRepo } = createService();

    walletRepo.findOne.mockResolvedValue(null as never);

    await expect(service.getTransactions('driver-without-wallet')).resolves.toEqual([]);
    expect(txRepo.find).not.toHaveBeenCalled();
  });
});
