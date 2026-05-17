import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PayoutsService } from '../payouts.service';
import { PaymobPayoutService } from '../services/paymob-payout.service';

@Processor('payouts')
export class PayoutsProcessor extends WorkerHost {
  private readonly logger = new Logger(PayoutsProcessor.name);

  constructor(
    private readonly payoutsService: PayoutsService,
    private readonly paymobService: PaymobPayoutService,
  ) {
    super();
  }

  async process(job: Job<{ payoutId: string }>): Promise<any> {
    const { payoutId } = job.data;
    this.logger.log(`Processing payout job ${job.id} for payout ${payoutId}`);

    // This method will handle the actual integration call and state transitions
    // We already have some logic in PayoutsService.approvePayout, but we should refactor it
    // to be called from here or move the logic here for better retry handling.
    
    // For now, let's trigger the service method we'll refactor shortly.
    return this.payoutsService.executePayout(payoutId);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`Payout job ${job?.id} failed: ${error.message}`);
  }
}
