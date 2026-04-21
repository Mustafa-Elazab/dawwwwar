import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriverProfileEntity } from '../../database/entities/driver-profile.entity';
import { WalletEntity } from '../../database/entities/wallet.entity';
import { WalletTransactionEntity } from '../../database/entities/wallet-transaction.entity';
import type { UpdateLocationDto } from './dto/update-location.dto';

export interface DriverEarningsSummary {
  todayDeliveries: number;
  todayGross: number;
  todayCommission: number;
  todayNet: number;
  weeklyData: Array<{
    day: string;
    dayAr: string;
    net: number;
    deliveries: number;
  }>;
}

const DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_AR = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(DriverProfileEntity)
    private readonly driverRepo: Repository<DriverProfileEntity>,
    @InjectRepository(WalletEntity)
    private readonly walletRepo: Repository<WalletEntity>,
    @InjectRepository(WalletTransactionEntity)
    private readonly txRepo: Repository<WalletTransactionEntity>,
  ) {}

  async getProfile(userId: string): Promise<DriverProfileEntity> {
    const profile = await this.driverRepo.findOne({
      where: { userId },
      relations: ['user'],
    });
    if (!profile) throw new NotFoundException('Driver profile not found');
    return profile;
  }

  async setOnline(userId: string, isOnline: boolean): Promise<DriverProfileEntity> {
    const profile = await this.getProfile(userId);
    await this.driverRepo.update(profile.id, {
      isOnline,
      ...(isOnline ? {} : { currentLatitude: undefined, currentLongitude: undefined }),
    });
    return this.getProfile(userId);
  }

  async updateLocation(userId: string, dto: UpdateLocationDto): Promise<void> {
    const profile = await this.getProfile(userId);
    await this.driverRepo.update(profile.id, {
      currentLatitude: dto.latitude,
      currentLongitude: dto.longitude,
      lastLocationUpdate: new Date(),
    });
  }

  async getEarningsSummary(userId: string): Promise<DriverEarningsSummary> {
    const wallet = await this.walletRepo.findOne({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Get today's commission transactions (each = one completed delivery)
    const todayTxs = await this.txRepo
      .createQueryBuilder('tx')
      .where('tx.walletId = :walletId', { walletId: wallet.id })
      .andWhere("tx.reason = 'COMMISSION_DEDUCTION'")
      .andWhere('tx.createdAt >= :start', { start: todayStart })
      .getMany();

    const COMMISSION = 5; // EGP per delivery
    const DELIVERY_FEE = 12; // EGP base fee

    const todayDeliveries = todayTxs.length;
    const todayGross = todayDeliveries * (DELIVERY_FEE + COMMISSION);
    const todayCommission = todayDeliveries * COMMISSION;
    const todayNet = todayDeliveries * DELIVERY_FEE;

    // Build 7-day chart: query past 7 days grouped by day
    const weeklyData = DAYS_EN.map((day, i) => {
      const dayStart = new Date();
      // Offset to get each day of this week
      const diff = i - dayStart.getDay();
      dayStart.setDate(dayStart.getDate() + diff);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);
      const isToday = i === new Date().getDay();
      // For the chart use local delivery count (full DB query would be more precise in prod)
      return {
        day,
        dayAr: DAYS_AR[i] ?? day,
        net: isToday ? todayNet : 0,   // Phase 3: query real daily totals
        deliveries: isToday ? todayDeliveries : 0,
      };
    });

    return { todayDeliveries, todayGross, todayCommission, todayNet, weeklyData };
  }

  async getWalletBalance(userId: string): Promise<number> {
    const wallet = await this.walletRepo.findOne({ where: { userId } });
    return Number(wallet?.balance ?? 0);
  }

  /** Returns all online drivers — used by order assignment logic */
  async getOnlineDrivers(): Promise<DriverProfileEntity[]> {
    return this.driverRepo.find({
      where: { isOnline: true, isApproved: true, canReceiveOrders: true },
      relations: ['user'],
    });
  }
}
