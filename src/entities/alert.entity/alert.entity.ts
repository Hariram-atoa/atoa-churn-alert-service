import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AlertSeverityEnum } from '../../enum/alert.severity.enum';
import { AlertStatusEnum } from '../../enum/alert.status.enum';

@Entity('alert_entity')
@Index('alert_entity_merchant_id_index', ['merchantId'])
export class AlertEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 255,
    nullable: false,
    enum: AlertSeverityEnum,
  })
  severity: AlertSeverityEnum;

  @Column({ type: 'uuid', nullable: false })
  merchantId: string;

  @Column({ type: 'jsonb', nullable: true })
  summary?: {
    [key: string]: any;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    length: 255,
    nullable: false,
    enum: AlertStatusEnum,
  })
  status: AlertStatusEnum;

  @Column({ type: 'date', nullable: true })
  followUpDate?: Date;

  @Column({ nullable: true })
  followUpReason?: string;
}
