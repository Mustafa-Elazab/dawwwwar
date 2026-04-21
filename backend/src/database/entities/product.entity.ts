import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MerchantEntity } from './merchant.entity';

@Entity('products')
@Index(['merchantId'])
export class ProductEntity extends BaseEntity {
  @ManyToOne(() => MerchantEntity)
  @JoinColumn({ name: 'merchant_id' })
  merchant: MerchantEntity;

  @Column({ name: 'merchant_id' })
  merchantId: string;

  @Column()
  name: string;

  @Column({ name: 'name_ar' })
  nameAr: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ name: 'description_ar', nullable: true })
  descriptionAr?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'compare_at_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  compareAtPrice?: number;

  @Column({ type: 'text', array: true, default: [] })
  images: string[];

  @Column({ name: 'is_available', default: true })
  isAvailable: boolean;

  @Column({ name: 'category_id' })
  categoryId: string;

  @Column({ name: 'is_featured', default: false })
  isFeatured: boolean;

  @Column({ name: 'total_orders', default: 0 })
  totalOrders: number;
}
