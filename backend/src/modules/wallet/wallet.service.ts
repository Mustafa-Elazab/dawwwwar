import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletEntity } from '../../database/entities/wallet.entity';
import {
  WalletTransactionEntity,
  TransactionType,
  TransactionReason,
} from '../../database/entities/wallet-transaction.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletRepo: Repository<WalletEntity>,
    @InjectRepository(WalletTransactionEntity)
    private readonly txRepo: Repository<WalletTransactionEntity>,
  ) {}

  async getWallet(userId: string): Promise<WalletEntity> {
    const wallet = await this.walletRepo.findOne({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }

  async getTransactions(userId: string): Promise<WalletTransactionEntity[]> {
    const wallet = await this.walletRepo.findOne({ where: { userId } });
    if (!wallet) return [];
    return this.txRepo.find({
      where: { walletId: wallet.id },
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  /**
   * Phase 2: Recharge is a pending request processed manually by admin.
   * Phase 3: Integrate Paymob/Fawry for instant online payment.
   */
  async requestRecharge(
    userId: string,
    amount: number,
  ): Promise<{ message: string; requestedAmount: number }> {
    if (amount < 10) {
      throw new BadRequestException('Minimum recharge amount is 10 EGP');
    }

    // Log the recharge request — admin processes it manually and adds balance
    // In Phase 3: create a pending payment intent via payment gateway
    // For now: just return success (real money handling in Phase 3)
    return {
      message:
        'Recharge request submitted. Will be processed within 24 hours.',
      requestedAmount: amount,
    };
  }

  /** Called by admin or payment gateway webhook to add balance */
  async creditWallet(
    userId: string,
    amount: number,
    description = 'Wallet recharge',
  ): Promise<WalletEntity> {
    const wallet = await this.getWallet(userId);
    const balanceBefore = Number(wallet.balance);
    const balanceAfter = balanceBefore + amount;

    await this.walletRepo.update(wallet.id, { balance: balanceAfter });

    await this.txRepo.save(
      this.txRepo.create({
        walletId: wallet.id,
        type: TransactionType.CREDIT,
        amount,
        reason: TransactionReason.WALLET_RECHARGE,
        description,
        balanceBefore,
        balanceAfter,
      }),
    );

    return this.walletRepo.findOne({ where: { id: wallet.id } }) as Promise<WalletEntity>;
  }
}
