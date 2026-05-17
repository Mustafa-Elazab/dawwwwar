import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { WalletEntity } from '../../database/entities/wallet.entity';
import {
  WalletTransactionEntity,
  TransactionType,
  TransactionReason,
} from '../../database/entities/wallet-transaction.entity';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import axios from 'axios';
import { PaymobWebhookDto } from './dto/paymob-webhook.dto';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletRepo: Repository<WalletEntity>,
    @InjectRepository(WalletTransactionEntity)
    private readonly txRepo: Repository<WalletTransactionEntity>,
    private readonly config: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  async getWallet(userId: string): Promise<WalletEntity> {
    const wallet = await this.walletRepo.findOne({ where: { userId } });
    if (!wallet) throw new NotFoundException('WALLET_NOT_FOUND');
    return wallet;
  }

  /**
   * RESERVED BALANCE LOGIC:
   * available = balance - pendingWithdrawal
   */
  async getAvailableBalance(userId: string): Promise<number> {
    const wallet = await this.getWallet(userId);
    return Number(wallet.balance) - Number(wallet.pendingWithdrawal);
  }

  /**
   * LOCK FUNDS (Step 1 of Payout)
   * Moves amount from 'available' to 'pendingWithdrawal'.
   */
  async lockFunds(userId: string, amount: number, manager: EntityManager): Promise<void> {
    const wallet = await manager.findOne(WalletEntity, {
      where: { userId },
      lock: { mode: 'pessimistic_write' },
    });
    if (!wallet) throw new NotFoundException('WALLET_NOT_FOUND');

    const available = Number(wallet.balance) - Number(wallet.pendingWithdrawal);
    if (available < amount) {
      throw new BadRequestException('INSUFFICIENT_AVAILABLE_FUNDS');
    }

    await manager.update(WalletEntity, wallet.id, {
      pendingWithdrawal: Number(wallet.pendingWithdrawal) + amount,
    });
  }

  /**
   * CONFIRM FUNDS (Step 4 of Payout - Success)
   * Permanently deducts from balance and clears pending status.
   */
  async confirmFunds(
    userId: string,
    amount: number,
    reason: TransactionReason,
    description: string,
    manager: EntityManager,
    referenceId?: string,
  ): Promise<void> {
    // Idempotency check
    if (referenceId) {
      const existingTx = await manager.findOne(WalletTransactionEntity, {
        where: { referenceId },
      });
      if (existingTx) {
        this.logger.log(`Idempotent return for confirmFunds: ${referenceId}`);
        return;
      }
    }

    const wallet = await manager.findOne(WalletEntity, {
      where: { userId },
      lock: { mode: 'pessimistic_write' },
    });
    if (!wallet) throw new NotFoundException('WALLET_NOT_FOUND');

    const balanceBefore = Number(wallet.balance);
    const balanceAfter = balanceBefore - amount;

    await manager.update(WalletEntity, wallet.id, {
      balance: balanceAfter,
      pendingWithdrawal: Math.max(0, Number(wallet.pendingWithdrawal) - amount),
    });

    // Create final ledger entry
    await manager.save(
      manager.create(WalletTransactionEntity, {
        walletId: wallet.id,
        type: TransactionType.DEBIT,
        amount,
        reason,
        description,
        referenceId,
        balanceBefore,
        balanceAfter,
      }),
    );
  }

  /**
   * RELEASE FUNDS (Step 4 of Payout - Failure/Reject)
   * Moves funds back to 'available'.
   */
  async releaseFunds(userId: string, amount: number, manager: EntityManager): Promise<void> {
    const wallet = await manager.findOne(WalletEntity, {
      where: { userId },
      lock: { mode: 'pessimistic_write' },
    });
    if (!wallet) throw new NotFoundException('WALLET_NOT_FOUND');

    await manager.update(WalletEntity, wallet.id, {
      pendingWithdrawal: Math.max(0, Number(wallet.pendingWithdrawal) - amount),
    });
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
   * Universal method to apply a credit (increase balance) with transaction safety and locking.
   * Can participate in an existing transaction if an EntityManager is provided.
   */
  async creditWallet(
    userId: string,
    amount: number,
    reason: TransactionReason,
    description: string,
    orderId?: string,
    existingManager?: EntityManager,
    referenceId?: string,
  ): Promise<WalletEntity> {
    const execute = async (manager: EntityManager) => {
      // Idempotency check
      if (referenceId) {
        const existingTx = await manager.findOne(WalletTransactionEntity, {
          where: { referenceId },
        });
        if (existingTx) {
          this.logger.log(`Idempotent return for credit: ${referenceId}`);
          return manager.findOne(WalletEntity, { where: { userId } });
        }
      }

      // 1. Fetch wallet with pessimistic lock to prevent concurrent updates
      const wallet = await manager.findOne(WalletEntity, {
        where: { userId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!wallet) throw new NotFoundException('WALLET_NOT_FOUND');

      const balanceBefore = Number(wallet.balance);
      const balanceAfter = balanceBefore + amount;

      // 2. Update balance
      await manager.update(WalletEntity, wallet.id, { balance: balanceAfter });

      // 3. Create ledger entry
      await manager.save(
        manager.create(WalletTransactionEntity, {
          walletId: wallet.id,
          type: TransactionType.CREDIT,
          amount,
          reason,
          orderId,
          description,
          referenceId,
          balanceBefore,
          balanceAfter,
        }),
      );

      return manager.findOne(WalletEntity, { where: { id: wallet.id } });
    };

    if (existingManager) return execute(existingManager) as Promise<WalletEntity>;
    return this.dataSource.transaction((manager) => execute(manager)) as Promise<WalletEntity>;
  }

  /**
   * Universal method to apply a debit (decrease balance) with transaction safety and locking.
   * Checks for sufficient balance before deducting.
   * Can participate in an existing transaction if an EntityManager is provided.
   */
  async debitWallet(
    userId: string,
    amount: number,
    reason: TransactionReason,
    description: string,
    orderId?: string,
    existingManager?: EntityManager,
    referenceId?: string,
  ): Promise<WalletEntity> {
    const execute = async (manager: EntityManager) => {
      // Idempotency check
      if (referenceId) {
        const existingTx = await manager.findOne(WalletTransactionEntity, {
          where: { referenceId },
        });
        if (existingTx) {
          this.logger.log(`Idempotent return for debit: ${referenceId}`);
          return manager.findOne(WalletEntity, { where: { userId } });
        }
      }

      // 1. Fetch wallet with pessimistic lock
      const wallet = await manager.findOne(WalletEntity, {
        where: { userId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!wallet) throw new NotFoundException('WALLET_NOT_FOUND');

      const balanceBefore = Number(wallet.balance);
      if (balanceBefore < amount) {
        throw new BadRequestException('INSUFFICIENT_WALLET_BALANCE');
      }

      const balanceAfter = balanceBefore - amount;

      // 2. Update balance
      await manager.update(WalletEntity, wallet.id, { balance: balanceAfter });

      // 3. Create ledger entry
      await manager.save(
        manager.create(WalletTransactionEntity, {
          walletId: wallet.id,
          type: TransactionType.DEBIT,
          amount,
          reason,
          orderId,
          description,
          referenceId,
          balanceBefore,
          balanceAfter,
        }),
      );

      return manager.findOne(WalletEntity, { where: { id: wallet.id } });
    };

    if (existingManager) return execute(existingManager) as Promise<WalletEntity>;
    return this.dataSource.transaction((manager) => execute(manager)) as Promise<WalletEntity>;
  }

  /**
   * Phase 3: Paymob Integration for online recharge
   */
  async requestRecharge(
    userId: string,
    amount: number,
  ): Promise<{ paymentKey: string; requestedAmount: number }> {
    if (amount < 10) {
      throw new BadRequestException('MIN_RECHARGE_AMOUNT');
    }

    const apiKey = this.config.get<string>('app.paymobApiKey');
    const integrationId = this.config.get<string>('app.paymobIntegrationId');

    if (!apiKey || !integrationId) {
      this.logger.warn('Paymob not configured, falling back to dummy response');
      if (process.env.NODE_ENV !== 'production') {
        const fakeOrderId = `${userId}_${Date.now()}`;
        setTimeout(() => {
          this.handlePaymobWebhook({
            type: 'TRANSACTION',
            obj: { success: true, order: { merchant_order_id: fakeOrderId }, amount_cents: amount * 100, id: Date.now() },
          } as any).catch((e) => this.logger.error('Dev recharge simulation failed', e));
        }, 1000);
      }
      return { paymentKey: 'dummy_key_because_paymob_not_configured', requestedAmount: amount };
    }

    try {
      // 1. Auth payload
      const authRes = await axios.post('https://accept.paymob.com/api/auth/tokens', {
        api_key: apiKey,
      });
      const token = authRes.data.token;

      // 2. Order Registration
      const orderRes = await axios.post('https://accept.paymob.com/api/ecommerce/orders', {
        auth_token: token,
        delivery_needed: 'false',
        amount_cents: amount * 100,
        currency: 'EGP',
        merchant_order_id: `${userId}_${Date.now()}`,
      });
      const orderId = orderRes.data.id;

      // 3. Payment Key Generation
      const keyRes = await axios.post('https://accept.paymob.com/api/acceptance/payment_keys', {
        auth_token: token,
        amount_cents: amount * 100,
        expiration: 3600,
        order_id: orderId,
        billing_data: {
          apartment: 'NA',
          email: 'user@dawwar.app',
          floor: 'NA',
          first_name: 'Dawwar',
          street: 'NA',
          building: 'NA',
          phone_number: '+201000000000',
          shipping_method: 'NA',
          postal_code: 'NA',
          city: 'NA',
          country: 'EG',
          last_name: 'User',
          state: 'NA',
        },
        currency: 'EGP',
        integration_id: integrationId,
      });

      return { paymentKey: keyRes.data.token, requestedAmount: amount };
    } catch (err: unknown) {
      this.logger.error('Paymob API error', err);
      throw new BadRequestException('PAYMENT_GATEWAY_ERROR');
    }
  }

  // ── Webhook handling ──────────────────────────────────────────────

  verifyPaymobHmac(payload: any, hmacHeader: string): boolean {
    const secret = this.config.get<string>('app.paymobHmacSecret');
    if (!secret) return true; // skip validation if not configured in dev

    const { obj } = payload;
    // Lexicographical order according to Paymob docs
    const concatenatedString = [
      obj.amount_cents,
      obj.created_at,
      obj.currency,
      obj.error_occured,
      obj.has_parent_transaction,
      obj.id,
      obj.integration_id,
      obj.is_3d_secure,
      obj.is_auth,
      obj.is_capture,
      obj.is_refunded,
      obj.is_standalone_payment,
      obj.is_voided,
      obj.order.id,
      obj.owner,
      obj.pending,
      obj.source_data.pan,
      obj.source_data.sub_type,
      obj.source_data.type,
      obj.success,
    ].join('');

    const hash = crypto
      .createHmac('sha512', secret)
      .update(concatenatedString)
      .digest('hex');

    return hash === hmacHeader;
  }

  async handlePaymobWebhook(dto: PaymobWebhookDto): Promise<void> {
    if (dto.type !== 'TRANSACTION' || !dto.obj.success) {
      return;
    }

    const merchantOrderId = dto.obj.order.merchant_order_id;
    if (!merchantOrderId) return;

    // extract userId back
    const userId = merchantOrderId.split('_')[0];
    if (!userId) return;

    const amountEGP = Math.floor(dto.obj.amount_cents / 100);

    // Give balance using the new safe transactional method
    await this.creditWallet(
      userId,
      amountEGP,
      TransactionReason.WALLET_RECHARGE,
      `Online payment (Tx: ${dto.obj.id})`,
      undefined,
      undefined,
      `PAYMOB_${dto.obj.id}`
    );
  }
}
