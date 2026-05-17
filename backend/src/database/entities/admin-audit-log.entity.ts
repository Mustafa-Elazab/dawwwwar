import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

export enum AdminAction {
  MERCHANT_APPROVE = 'MERCHANT_APPROVE',
  MERCHANT_REJECT = 'MERCHANT_REJECT',
  MERCHANT_SUSPEND = 'MERCHANT_SUSPEND',
  MERCHANT_ACTIVATE = 'MERCHANT_ACTIVATE',
  DRIVER_APPROVE = 'DRIVER_APPROVE',
  DRIVER_REJECT = 'DRIVER_REJECT',
  ORDER_CANCEL = 'ORDER_CANCEL',
  ORDER_ASSIGN = 'ORDER_ASSIGN',
  WALLET_ADJUST = 'WALLET_ADJUST',
}

@Entity('admin_audit_logs')
export class AdminAuditLogEntity extends BaseEntity {
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'admin_id' })
  admin: UserEntity;

  @Column({ name: 'admin_id' })
  adminId: string;

  @Column({ type: 'enum', enum: AdminAction })
  action: AdminAction;

  @Column({ name: 'target_type' })
  targetType: string;

  @Column({ name: 'target_id' })
  targetId: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ nullable: true })
  ip?: string;
}
