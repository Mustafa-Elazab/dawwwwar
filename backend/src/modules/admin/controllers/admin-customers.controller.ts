import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity, UserRole } from '../../../database/entities/user.entity';
import { Roles } from '../../../common/decorators/roles.decorator';

@ApiTags('Admin / Customers')
@Controller('admin/customers')
@ApiBearerAuth('access-token')
@Roles(UserRole.ADMIN)
export class AdminCustomersController {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all customers' })
  async findAll() {
    return {
      success: true,
      data: await this.userRepo.find({
        where: { role: UserRole.CUSTOMER },
        order: { createdAt: 'DESC' },
      }),
    };
  }
}
