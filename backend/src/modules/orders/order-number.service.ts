import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '../../database/entities/order.entity';

@Injectable()
export class OrderNumberService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
  ) {}

  async generate(): Promise<string> {
    // Get count for today to create sequential daily IDs
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const count = await this.orderRepo.count({
      where: { createdAt: today as unknown as Date },
    });
    const seq = String(count + 1).padStart(4, '0');
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    return `ORD-${dateStr}-${seq}`;
  }
}
