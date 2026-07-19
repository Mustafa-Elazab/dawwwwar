import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { WalletEntity } from '../../database/entities/wallet.entity';
import { UserEntity } from '../../database/entities/user.entity';
import {
  WalletRechargeEntity,
  WalletRechargeStatus,
} from '../../database/entities/wallet-recharge.entity';
import {
  WalletTransactionEntity,
  TransactionType,
  TransactionReason,
} from '../../database/entities/wallet-transaction.entity';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import axios from 'axios';
import { PaymobWebhookDto } from './dto/paymob-webhook.dto';
import { GatewayService } from '../gateway/gateway.service';

type PaymobAuthResponse = {
  token: string;
};

type PaymobOrderResponse = {
  id: number;
};

type PaymobPaymentKeyResponse = {
  token: string;
};

export interface WalletRechargeCheckout {
  paymentKey: string;
  iframeId?: string;
  checkoutUrl: string;
  paymobOrderId: string;
  requestedAmount: number;
}

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletRepo: Repository<WalletEntity>,
    @InjectRepository(WalletTransactionEntity)
    private readonly txRepo: Repository<WalletTransactionEntity>,
    @InjectRepository(WalletRechargeEntity)
    private readonly rechargeRepo: Repository<WalletRechargeEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly config: ConfigService,
    private readonly dataSource: DataSource,
    private readonly gatewayService: GatewayService,
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
  ): Promise<WalletRechargeCheckout> {
    if (amount < 10) {
      throw new BadRequestException('MIN_RECHARGE_AMOUNT');
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    const apiKey =
      this.config.get<string>('paymob.apiKey') ||
      this.config.get<string>('app.paymobApiKey');
    const integrationId =
      this.config.get<string>('paymob.integrationIdCard') ||
      this.config.get<string>('app.paymobIntegrationId');
    const iframeId = this.config.get<string>('paymob.iframeId');

    if (!apiKey || !integrationId || !iframeId) {
      if (process.env.NODE_ENV === 'production') {
        this.logger.error('Paymob recharge requested but Paymob is not configured');
        throw new BadRequestException('PAYMENT_GATEWAY_NOT_CONFIGURED');
      }

      this.logger.warn('Paymob not configured, falling back to dummy response');
      const merchantOrderId = `RECHARGE_${userId}_${Date.now()}`;
      const fakeOrderId = Date.now().toString();
      const checkoutUrl = `https://dawwar.com/payment/success?success=true&order=${fakeOrderId}`;

      await this.rechargeRepo.save(
        this.rechargeRepo.create({
          userId,
          paymobOrderId: fakeOrderId,
          amount,
          currency: 'EGP',
          status: WalletRechargeStatus.PENDING,
          paymentKey: 'dev_payment_key',
          checkoutUrl,
          metadata: { merchantOrderId, mode: 'development' },
        }),
      );

      setTimeout(() => {
        this.handlePaymobWebhook({
          type: 'TRANSACTION',
          obj: {
            success: true,
            order: { id: Number(fakeOrderId), merchant_order_id: merchantOrderId },
            amount_cents: Math.round(amount * 100),
            id: Date.now(),
          },
        }).catch((e) => this.logger.error('Dev recharge simulation failed', e));
      }, 1000);

      return {
        paymentKey: 'dev_payment_key',
        iframeId: 'dev',
        checkoutUrl,
        paymobOrderId: fakeOrderId,
        requestedAmount: amount,
      };
    }

    try {
      const merchantOrderId = `RECHARGE_${userId}_${Date.now()}`;
      const amountCents = Math.round(amount * 100);
      const [firstName = 'Dawwar', ...lastParts] = user.name?.split(' ') ?? [];
      const lastName = lastParts.join(' ') || 'Customer';

      const authRes = await axios.post<PaymobAuthResponse>('https://accept.paymob.com/api/auth/tokens', {
        api_key: apiKey,
      });
      const token = authRes.data.token;

      const orderRes = await axios.post<PaymobOrderResponse>('https://accept.paymob.com/api/ecommerce/orders', {
        auth_token: token,
        delivery_needed: 'false',
        amount_cents: amountCents,
        currency: 'EGP',
        merchant_order_id: merchantOrderId,
        items: [
          {
            name: 'Dawwar Wallet Recharge',
            amount_cents: amountCents,
            description: `Wallet recharge for ${user.phone}`,
            quantity: 1,
          },
        ],
      });
      const orderId = orderRes.data.id;

      const keyRes = await axios.post<PaymobPaymentKeyResponse>('https://accept.paymob.com/api/acceptance/payment_keys', {
        auth_token: token,
        amount_cents: amountCents,
        expiration: 3600,
        order_id: orderId,
        billing_data: {
          apartment: 'NA',
          email: `${user.id}@dawwar.app`,
          floor: 'NA',
          first_name: firstName,
          street: 'NA',
          building: 'NA',
          phone_number: user.phone,
          shipping_method: 'NA',
          postal_code: 'NA',
          city: 'Cairo',
          country: 'EG',
          last_name: lastName,
          state: 'Cairo',
        },
        currency: 'EGP',
        integration_id: Number(integrationId),
      });

      const paymentKey = keyRes.data.token;
      const checkoutUrl = `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentKey}`;

      await this.rechargeRepo.save(
        this.rechargeRepo.create({
          userId,
          paymobOrderId: orderId.toString(),
          amount,
          currency: 'EGP',
          status: WalletRechargeStatus.PENDING,
          paymentKey,
          checkoutUrl,
          metadata: { merchantOrderId },
        }),
      );

      return {
        paymentKey,
        iframeId,
        checkoutUrl,
        paymobOrderId: orderId.toString(),
        requestedAmount: amount,
      };
    } catch (err: unknown) {
      this.logger.error('Paymob API error', err);
      throw new BadRequestException('PAYMENT_GATEWAY_ERROR');
    }
  }

  // ── Webhook handling ──────────────────────────────────────────────

  verifyPaymobHmac(payload: PaymobWebhookDto, hmacHeader?: string): boolean {
    const secret =
      this.config.get<string>('paymob.hmacSecret') ||
      this.config.get<string>('app.paymobHmacSecret');

    if (!secret) {
      return process.env.NODE_ENV !== 'production';
    }

    if (!hmacHeader) {
      return false;
    }

    const obj = payload.obj;
    const orderId = obj.order?.id;
    const sourceData = obj.source_data ?? {};
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
      orderId,
      obj.owner,
      obj.pending,
      sourceData.pan,
      sourceData.sub_type,
      sourceData.type,
      obj.success,
    ].map((value) => value ?? '').join('');

    const hash = crypto
      .createHmac('sha512', secret)
      .update(concatenatedString)
      .digest('hex');

    const expected = Buffer.from(hash, 'hex');
    const received = Buffer.from(hmacHeader, 'hex');
    return expected.length === received.length && crypto.timingSafeEqual(expected, received);
  }

  async handlePaymobWebhook(dto: PaymobWebhookDto): Promise<void> {
    if (dto.type !== 'TRANSACTION' || !dto.obj.success) {
      return;
    }

    const paymobOrderId = dto.obj.order?.id?.toString();
    const transactionId = dto.obj.id?.toString();
    if (!paymobOrderId || !transactionId) {
      return;
    }

    const referenceId = `PAYMOB_TX_${transactionId}`;
    const existingTx = await this.txRepo.findOne({ where: { referenceId } });
    if (existingTx) {
      return;
    }

    const pending = await this.rechargeRepo.findOne({ where: { paymobOrderId } });
    if (!pending) {
      this.logger.warn(`Unknown Paymob recharge order: ${paymobOrderId}`);
      return;
    }

    if (pending.status === WalletRechargeStatus.COMPLETED) {
      return;
    }

    await this.dataSource.transaction(async (manager) => {
      await this.creditWallet(
        pending.userId,
        Number(pending.amount),
        TransactionReason.WALLET_RECHARGE,
        `Online payment (Paymob tx: ${transactionId})`,
        undefined,
        manager,
        referenceId,
      );

      await manager.update(WalletRechargeEntity, pending.id, {
        status: WalletRechargeStatus.COMPLETED,
        paymobTransactionId: transactionId,
      });
    });

    this.gatewayService.notifyWalletRecharged(pending.userId, Number(pending.amount));
  }
}
