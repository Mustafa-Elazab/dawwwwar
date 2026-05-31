import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { MerchantEntity } from './merchant.entity';
import { ProductEntity } from './product.entity';

@Entity('favorites')
@Index(['userId', 'merchantId'], { unique: true, where: '"merchantId" IS NOT NULL' })
@Index(['userId', 'productId'], { unique: true, where: '"productId" IS NOT NULL' })
export class FavoriteEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid', nullable: true })
  merchantId?: string;

  @Column({ type: 'uuid', nullable: true })
  productId?: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => MerchantEntity, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'merchantId' })
  merchant?: MerchantEntity;

  @ManyToOne(() => ProductEntity, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'productId' })
  product?: ProductEntity;
}
