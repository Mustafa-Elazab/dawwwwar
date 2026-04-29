import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressEntity } from '../../database/entities/address.entity';
import type { CreateAddressDto } from './dto/create-address.dto';
import type { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly repo: Repository<AddressEntity>,
  ) {}

  async findByUser(userId: string): Promise<AddressEntity[]> {
    return this.repo.find({
      where: { userId },
      order: { isDefault: 'DESC', createdAt: 'ASC' },
    });
  }

  async findById(id: string, userId: string): Promise<AddressEntity> {
    const address = await this.repo.findOne({ where: { id } });
    if (!address) throw new NotFoundException('ADDRESS_NOT_FOUND');
    if (address.userId !== userId) throw new ForbiddenException();
    return address;
  }

  async create(userId: string, dto: CreateAddressDto): Promise<AddressEntity> {
    // If new address is default, clear existing default
    if (dto.isDefault) {
      await this.repo.update({ userId, isDefault: true }, { isDefault: false });
    }
    const address = this.repo.create({ ...dto, userId });
    return this.repo.save(address);
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateAddressDto,
  ): Promise<AddressEntity> {
    const address = await this.findById(id, userId);
    if (dto.isDefault) {
      await this.repo.update({ userId, isDefault: true }, { isDefault: false });
    }
    Object.assign(address, dto);
    return this.repo.save(address);
  }

  async remove(id: string, userId: string): Promise<void> {
    const address = await this.findById(id, userId);
    await this.repo.remove(address);
  }

  async setDefault(id: string, userId: string): Promise<AddressEntity> {
    // Clear current default
    await this.repo.update({ userId, isDefault: true }, { isDefault: false });
    // Set new default
    await this.repo.update({ id, userId }, { isDefault: true });
    return this.findById(id, userId);
  }
}
