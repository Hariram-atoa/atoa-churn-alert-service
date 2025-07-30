import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_snapshot_entity')
@Index('user_snapshot_entity_business_id_index', ['businessId'])
@Index('user_snapshot_entity_userid_index', ['userId'])
@Index('user_snapshot_entity_store_id_index', ['storeId'])
export class UserSnapshotEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  businessId: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @Column({ type: 'date', nullable: false })
  monthStart: Date;

  @Column({ type: 'date', nullable: false })
  monthEnd: Date;

  @Column({ type: 'jsonb', nullable: true })
  metaData?: {
    [key: string]: any;
  };

  @Column({ type: 'uuid', nullable: false })
  storeId: string;

  @Column({ type: 'integer', nullable: true })
  transactionCount?: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  transactionVolume?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
