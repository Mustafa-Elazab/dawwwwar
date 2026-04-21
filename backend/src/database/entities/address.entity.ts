import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity('addresses')
@Index(['userId'])
export class AddressEntity extends BaseEntity {
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  label: string;

  @Column()
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude: number;

  @Column({ name: 'building_number', nullable: true })
  buildingNumber?: string;

  @Column({ nullable: true })
  floor?: string;

  @Column({ nullable: true })
  apartment?: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  notes?: string;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;
}
