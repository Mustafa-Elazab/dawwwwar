import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('categories')
export class CategoryEntity extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ name: 'name_ar' })
  nameAr: string;

  @Column()
  icon: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
