import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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
    if (!profile) throw new NotFoundException('DRIVER_PROFILE_NOT_FOUND');
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

    // 1. Sequence and Freshness Validation (P0-03)
    if (dto.sequence !== undefined && dto.sequence <= profile.lastSequenceNumber) {
      // Out of order update, likely from a buffer replay or network lag. 
      // Skip but don't error to allow original order processing.
      return;
    }

    const lastUpdate = profile.lastLocationUpdate ? new Date(profile.lastLocationUpdate).getTime() : 0;
    const incomingTime = dto.timestamp ? new Date(dto.timestamp).getTime() : Date.now();

    if (incomingTime < lastUpdate) {
      return; // Chronologically stale update
    }

    // 2. Reject impossible jumps or very low accuracy points (Optional Hardening)
    if (dto.accuracy !== undefined && dto.accuracy > 100) {
      // GPS noise — log it but maybe don't update map for customer
    }

    // 3. Update Profile with tracking metadata
    await this.driverRepo.update(profile.id, {
      currentLatitude: dto.latitude,
      currentLongitude: dto.longitude,
      lastLocationUpdate: dto.timestamp ? new Date(dto.timestamp) : new Date(),
      lastSequenceNumber: dto.sequence ?? profile.lastSequenceNumber + 1,
      currentAccuracy: dto.accuracy,
      currentSpeed: dto.speed,
      batteryLevel: dto.batteryLevel,
      lastAppState: dto.appState,
    });

    // 4. Update PostGIS geography column
    await this.driverRepo.query(
      `UPDATE driver_profiles
       SET location = ST_SetSRID(ST_MakePoint($1, $2), 4326)
       WHERE id = $3`,
      [dto.longitude, dto.latitude, profile.id],
    );
  }

  async getEarningsSummary(userId: string): Promise<DriverEarningsSummary> {
    const wallet = await this.walletRepo.findOne({ where: { userId } });
    if (!wallet) throw new NotFoundException('WALLET_NOT_FOUND');

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

    // Build 7-day chart: query past 7 days with real daily totals
    const weeklyData: DriverEarningsSummary['weeklyData'] = [];
    for (let i = 0; i < 7; i++) {
      const dayStart = new Date();
      const diff = i - dayStart.getDay();
      dayStart.setDate(dayStart.getDate() + diff);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const dayTxs = await this.txRepo
        .createQueryBuilder('tx')
        .where('tx.walletId = :walletId', { walletId: wallet.id })
        .andWhere("tx.reason = 'COMMISSION_DEDUCTION'")
        .andWhere('tx.createdAt >= :start', { start: dayStart })
        .andWhere('tx.createdAt <= :end', { end: dayEnd })
        .getCount();

      weeklyData.push({
        day: DAYS_EN[i] ?? '',
        dayAr: DAYS_AR[i] ?? '',
        net: dayTxs * DELIVERY_FEE,
        deliveries: dayTxs,
      });
    }

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

  /** Find nearest online driver to a location — for auto-assignment */
  async findNearestOnlineDriver(
    latitude: number,
    longitude: number,
    radiusKm = 5,
  ): Promise<DriverProfileEntity | null> {
    const radiusMetres = radiusKm * 1000;

    return this.driverRepo
      .createQueryBuilder('driver')
      .where('driver.isOnline = true')
      .andWhere('driver.isApproved = true')
      .andWhere('driver.canReceiveOrders = true')
      .andWhere(
        `ST_DWithin(
          driver.location,
          ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
          :radius
        )`,
        { lat: latitude, lng: longitude, radius: radiusMetres },
      )
      .orderBy(
        `ST_Distance(
          driver.location,
          ST_SetSRID(ST_MakePoint(:lng2, :lat2), 4326)::geography
        )`,
        'ASC',
      )
      .setParameters({ lat2: latitude, lng2: longitude })
      .getOne();
  }

  async findAllForAdmin(status?: string): Promise<any[]> {
    const query = this.driverRepo
      .createQueryBuilder('driver')
      .leftJoinAndSelect('driver.user', 'user');

    if (status === 'online') {
      query.where('driver.isOnline = true');
    } else if (status === 'pending') {
      query.where('driver.isApproved = false');
    }

    const drivers = await query.orderBy('driver.createdAt', 'DESC').getMany();

    // Add operational health flags
    const STALE_THRESHOLD_MS = 60 * 1000; // 60 seconds
    const now = Date.now();

    return drivers.map((driver) => {
      const lastUpdate = driver.lastLocationUpdate ? new Date(driver.lastLocationUpdate).getTime() : 0;
      const isLocationStale = driver.isOnline && (now - lastUpdate > STALE_THRESHOLD_MS);
      
      return {
        ...driver,
        isLocationStale,
      };
    });
  }

  async setApprovalStatus(id: string, isApproved: boolean): Promise<DriverProfileEntity> {
    await this.driverRepo.update(id, { isApproved });
    return this.driverRepo.findOne({ where: { id }, relations: ['user'] }) as Promise<DriverProfileEntity>;
  }

  async findById(id: string): Promise<DriverProfileEntity | null> {
    return this.driverRepo.findOne({ where: { id }, relations: ['user'] });
  }
}
