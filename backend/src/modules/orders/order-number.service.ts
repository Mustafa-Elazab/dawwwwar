import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { OrderEntity } from '../../database/entities/order.entity';

@Injectable()
export class OrderNumberService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
  ) {}

  async generate(): Promise<string> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const count = await this.orderRepo.count({
      where: { createdAt: Between(startOfDay, endOfDay) },
    });
    const dateStr = startOfDay.toISOString().slice(0, 10).replace(/-/g, '');

    for (let offset = 1; offset <= 20; offset += 1) {
      const seq = String(count + offset).padStart(4, '0');
      const orderNumber = `ORD-${dateStr}-${seq}`;
      const existing = await this.orderRepo.exist({ where: { orderNumber } });
      if (!existing) return orderNumber;
    }

    return `ORD-${dateStr}-${Date.now().toString().slice(-6)}`;
  }
}
