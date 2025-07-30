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
import { AlertTypeEnum } from '../../enum/alert.type.enum';

@Entity('alert_entity')
@Index('alert_entity_merchant_id_index', ['merchantId'])
export class AlertEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
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
    type: 'enum',
    nullable: false,
    enum: AlertStatusEnum,
  })
  status: AlertStatusEnum;

  @Column({ type: 'date', nullable: true })
  followUpDate?: Date;

  @Column({ nullable: true })
  followUpReason?: string;

  @Column({ type: 'enum', nullable: false, enum: AlertTypeEnum })
  alertType: AlertTypeEnum;

  @Column({ type: 'uuid', nullable: true })
  assignedToUser?: string;

  @Column({ type: 'jsonb', nullable: true })
  comments?: {
    fromUser: string;
    comment: string;
  }[];
}
