import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, EntityManager } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { 
  PayoutRequestEntity, 
  PayoutStatus, 
  PayoutEventEntity 
} from '../../database/entities';
import { WalletService } from '../wallet/wallet.service';
import { PaymobPayoutService } from './services/paymob-payout.service';
import { RequestPayoutDto } from './dto/request-payout.dto';
import { TransactionReason } from '../../database/entities/wallet-transaction.entity';

@Injectable()
export class PayoutsService {
  private readonly logger = new Logger(PayoutsService.name);

  constructor(
    @InjectRepository(PayoutRequestEntity)
    private readonly payoutRepo: Repository<PayoutRequestEntity>,
    @InjectRepository(PayoutEventEntity)
    private readonly eventRepo: Repository<PayoutEventEntity>,
    private readonly walletService: WalletService,
    private readonly paymobService: PaymobPayoutService,
    private readonly dataSource: DataSource,
    @InjectQueue('payouts') private readonly payoutQueue: Queue,
  ) {}

  async requestPayout(userId: string, dto: RequestPayoutDto): Promise<PayoutRequestEntity> {
    return this.dataSource.transaction(async (manager) => {
      // 1. Lock funds in wallet
      await this.walletService.lockFunds(userId, dto.amount, manager);

      // 2. Create pending request
      const payout = manager.create(PayoutRequestEntity, {
        userId,
        amount: dto.amount,
        method: dto.method,
        status: PayoutStatus.PENDING,
      });
      const saved = await manager.save(payout);

      // 3. Log initial event
      await this.logEvent(saved.id, PayoutStatus.PENDING, 'Payout Requested', 'Driver requested a withdrawal.', manager);

      return saved;
    });
  }

  async approvePayout(id: string): Promise<PayoutRequestEntity> {
    const payout = await this.payoutRepo.findOne({ where: { id } });
    if (!payout) throw new NotFoundException('PAYOUT_NOT_FOUND');
    if (payout.status !== PayoutStatus.PENDING) {
      throw new BadRequestException('PAYOUT_ALREADY_PROCESSED');
    }

    // 1. Mark as APPROVED (Transition State)
    await this.payoutRepo.update(id, { status: PayoutStatus.APPROVED });
    await this.logEvent(id, PayoutStatus.APPROVED, 'Admin Approved', 'Waiting for processing queue.');

    // 2. Queue for execution
    await this.payoutQueue.add('process-payout', { payoutId: id }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 10000 },
    });

    return this.payoutRepo.findOne({ where: { id } }) as Promise<PayoutRequestEntity>;
  }

  async rejectPayout(id: string, reason: string): Promise<PayoutRequestEntity> {
    const payout = await this.payoutRepo.findOne({ where: { id } });
    if (!payout) throw new NotFoundException('PAYOUT_NOT_FOUND');
    if (payout.status !== PayoutStatus.PENDING) {
      throw new BadRequestException('PAYOUT_ALREADY_PROCESSED');
    }

    return this.dataSource.transaction(async (manager) => {
      // Release locked funds
      await this.walletService.releaseFunds(payout.userId, payout.amount, manager);
      
      // Mark as REJECTED
      await manager.update(PayoutRequestEntity, id, { status: PayoutStatus.REJECTED });
      await this.logEvent(id, PayoutStatus.REJECTED, 'Admin Rejected', reason, manager);
      
      return manager.findOne(PayoutRequestEntity, { where: { id } }) as Promise<PayoutRequestEntity>;
    });
  }

  /**
   * Actual execution called by BullMQ processor.
   */
  async executePayout(id: string): Promise<void> {
    const payout = await this.payoutRepo.findOne({ 
      where: { id },
      relations: ['user'] 
    });
    if (!payout || payout.status !== PayoutStatus.APPROVED) return;

    await this.logEvent(id, PayoutStatus.SENT, 'Processing Paymob', 'Sending disbursement request to Paymob.');

    const result = await this.paymobService.sendPayout(payout);

    if (result.success) {
      await this.payoutRepo.update(id, { 
        externalTransactionId: result.txId,
        paymentDetails: result.rawResponse,
      });
      await this.logEvent(id, PayoutStatus.SENT, 'Paymob Accepted', 'Transaction is pending provider settlement.');
    } else {
      // Logic for automatic retry or permanent failure
      await this.logEvent(id, PayoutStatus.FAILED, 'Paymob Failed', result.rawResponse?.message || 'Unknown error');
      throw new Error('PAYMOB_REJECTED'); // trigger queue retry if attempts left
    }
  }

  /**
   * Final settlement called by Webhook.
   */
  async settlePayout(externalId: string, success: boolean): Promise<void> {
    const payout = await this.payoutRepo.findOne({ where: { externalTransactionId: externalId } });
    if (!payout) {
      this.logger.warn(`Webhook received for unknown transaction: ${externalId}`);
      return;
    }

    if (payout.status === PayoutStatus.SENT || payout.status === PayoutStatus.APPROVED) {
      await this.dataSource.transaction(async (manager) => {
        if (success) {
          // Confirm wallet deduction
          await this.walletService.confirmFunds(
            payout.userId,
            payout.amount,
            TransactionReason.WITHDRAWAL,
            `Withdrawal settlement (Ref: ${externalId})`,
            manager,
            `PAYOUT_CONFIRM_${payout.id}`
          );
          await manager.update(PayoutRequestEntity, payout.id, { status: PayoutStatus.COMPLETED });
          await this.logEvent(payout.id, PayoutStatus.COMPLETED, 'Settled', 'Funds successfully transferred and wallet updated.', manager);
        } else {
          // Release funds
          await this.walletService.releaseFunds(payout.userId, payout.amount, manager);
          await manager.update(PayoutRequestEntity, payout.id, { status: PayoutStatus.FAILED });
          await this.logEvent(payout.id, PayoutStatus.FAILED, 'Transaction Failed', 'Provider failed to settle. Funds released.', manager);
        }
      });
    }
  }

  async logEvent(
    payoutRequestId: string, 
    status: PayoutStatus, 
    title: string, 
    description?: string,
    manager?: EntityManager
  ): Promise<void> {
    const repo = manager ? manager.getRepository(PayoutEventEntity) : this.eventRepo;
    await repo.save(repo.create({
      payoutRequestId,
      status,
      title,
      description,
    }));
  }

  // ── standard queries ───────────────────────────────────────────────

  async getMyPayouts(userId: string): Promise<PayoutRequestEntity[]> {
    return this.payoutRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findAllForAdmin(): Promise<PayoutRequestEntity[]> {
    return this.payoutRepo.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getPayoutDetails(id: string): Promise<any> {
    const payout = await this.payoutRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    const events = await this.eventRepo.find({
      where: { payoutRequestId: id },
      order: { createdAt: 'DESC' },
    });
    return { ...payout, events };
  }
}
