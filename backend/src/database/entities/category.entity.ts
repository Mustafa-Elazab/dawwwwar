import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('categories')
export class CategoryEntity extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ name: 'name_ar' })
  nameAr: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ unique: true, nullable: true })
  slug: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'parent_id', nullable: true })
  parentId: string | null;

  @ManyToOne(() => CategoryEntity, (cat) => cat.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: CategoryEntity;

  @OneToMany(() => CategoryEntity, (cat) => cat.parent)
  children: CategoryEntity[];
}
