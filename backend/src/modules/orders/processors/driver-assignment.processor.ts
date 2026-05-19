import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity, OrderStatus } from '../../../database/entities/order.entity';
import { UserEntity, UserRole } from '../../../database/entities/user.entity';
import { DriverProfileEntity } from '../../../database/entities/driver-profile.entity';
import { AppGateway } from '../../gateway/app.gateway';
import { Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

interface AssignmentJobData {
  orderId: string;
  merchantLat: number;
  merchantLng: number;
  excludeDriverIds: string[];
  attempt: number;
}

@Processor('driver-assignment')
export class DriverAssignmentProcessor extends WorkerHost {
  private readonly logger = new Logger(DriverAssignmentProcessor.name);

  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(DriverProfileEntity)
    private readonly driverProfileRepo: Repository<DriverProfileEntity>,
    private readonly gateway: AppGateway,
    @InjectQueue('driver-assignment') private readonly assignmentQueue: Queue,
  ) {
    super();
  }

  async process(job: Job<AssignmentJobData>): Promise<any> {
    const { orderId, merchantLat, merchantLng, excludeDriverIds, attempt } = job.data;

    // Max 5 attempts before alerting admin
    if (attempt > 5) {
      this.logger.error(`[Assignment] No driver found for order ${orderId} after 5 attempts`);
      return;
    }

    const order = await this.orderRepo.findOne({ 
      where: { id: orderId },
      relations: ['merchant', 'customer', 'items']
    });
    if (!order || order.status !== OrderStatus.READY) {
      this.logger.log(`[Assignment] Order ${orderId} is no longer READY. Status: ${order?.status}`);
      return;
    }

    // Find nearest available driver
    const driverProfile = await this.findNearestDriver(merchantLat, merchantLng, excludeDriverIds);

    if (!driverProfile || !driverProfile.user) {
      // No drivers available right now — retry in 30 seconds
      this.logger.log(`[Assignment] No drivers found for order ${orderId}. Retrying in 30s...`);
      await this.assignmentQueue.add('assign', job.data, { delay: 30_000 });
      return;
    }

    this.logger.log(`[Assignment] Pinging driver ${driverProfile.user.id} for order ${orderId} (Attempt ${attempt})`);

    // Notify driver via socket
    this.gateway.server.to(`driver:${driverProfile.user.id}`).emit('ORDER_STATUS_CHANGED', {
      orderId,
      status: 'ASSIGNED',
      order,
    });

    // Set a 30-second acceptance window
    setTimeout(async () => {
      const freshOrder = await this.orderRepo.findOne({ where: { id: orderId } });
      if (freshOrder?.status === OrderStatus.READY) {
        // Driver didn't accept — try next driver
        this.logger.log(`[Assignment] Driver ${driverProfile.user?.id} timed out. Re-queueing order ${orderId}`);
        await this.assignmentQueue.add('assign', {
          ...job.data,
          excludeDriverIds: [...excludeDriverIds, driverProfile.user?.id ?? ''],
          attempt: attempt + 1,
        });
      }
    }, 30_000);
  }

  private async findNearestDriver(
    merchantLat: number,
    merchantLng: number,
    excludeIds: string[],
  ): Promise<DriverProfileEntity | null> {
    // Find approved, online drivers without an active order
    const qb = this.driverProfileRepo
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.user', 'user')
      .where('user.role = :role', { role: UserRole.DRIVER })
      .andWhere('user.isApproved = true')
      .andWhere('profile.isOnline = true')
      .andWhere('profile.canReceiveOrders = true');

    if (excludeIds.length > 0) {
      qb.andWhere('user.id NOT IN (:...excludeIds)', { excludeIds });
    }

    const drivers = await qb.getMany();
    if (drivers.length === 0) return null;

    // Sort by distance (simple Haversine in JS)
    const withDistance = drivers.map(d => ({
      profile: d,
      dist: this.haversine(merchantLat, merchantLng, d.currentLatitude ?? 0, d.currentLongitude ?? 0),
    }));

    withDistance.sort((a, b) => a.dist - b.dist);
    return withDistance[0].profile;
  }

  private haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 +
      Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLng/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`[Assignment] Job ${job?.id} failed: ${error.message}`);
  }
}
