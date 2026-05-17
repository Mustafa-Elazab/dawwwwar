import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

@Processor('notifications')
export class NotificationsProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationsProcessor.name);

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.debug(`Processing notification job ${job.id} of type ${job.name}`);
    
    switch (job.name) {
      case 'push':
        // Simulation of failure to test DLQ
        if (job.data.userId === 'fail-test') {
          throw new Error('SIMULATED_PUSH_FAILURE');
        }
        this.logger.log(`Sending push to user ${job.data.userId}: ${job.data.title}`);
        break;
      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(
      `Job ${job.id} failed after ${job.attemptsMade} attempts. Error: ${error.message}`,
    );
    // In production, we'd send this to Sentry or a Slack/Telegram alert channel
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.debug(`Job ${job.id} completed successfully`);
  }
}
