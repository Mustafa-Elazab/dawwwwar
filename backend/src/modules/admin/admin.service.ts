import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminAuditLogEntity, AdminAction } from '../../database/entities/admin-audit-log.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminAuditLogEntity)
    private readonly auditRepo: Repository<AdminAuditLogEntity>,
  ) {}

  async logAction(
    adminId: string,
    action: AdminAction,
    targetType: string,
    targetId: string,
    metadata?: Record<string, any>,
    ip?: string,
  ) {
    const log = this.auditRepo.create({
      adminId,
      action,
      targetType,
      targetId,
      metadata,
      ip,
    });
    return this.auditRepo.save(log);
  }
}
