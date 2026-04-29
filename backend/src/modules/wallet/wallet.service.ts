import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ) {}

  async getWallet(userId: string): Promise<WalletEntity> {
    const wallet = await this.walletRepo.findOne({ where: { userId } });
    if (!wallet) throw new NotFoundException('WALLET_NOT_FOUND');
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
    // Lexicographical order according to Paymob docs:
    // amount_cents, created_at, currency, error_occured, has_parent_transaction, id, integration_id, is_3d_secure, is_auth, is_capture, is_refunded, is_standalone_payment, is_voided, order.id, owner, pending, source_data.pan, source_data.sub_type, source_data.type, success
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

    // Give balance
    await this.creditWallet(userId, amountEGP, `Online payment (Tx: ${dto.obj.id})`);
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
