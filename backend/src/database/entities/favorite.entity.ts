import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { MerchantEntity } from './merchant.entity';

@Entity('favorites')
@Index(['userId', 'merchantId'], { unique: true })
export class FavoriteEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  merchantId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => MerchantEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'merchantId' })
  merchant: MerchantEntity;
}
