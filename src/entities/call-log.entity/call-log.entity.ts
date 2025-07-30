import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { AlertEntity } from '../alert.entity/alert.entity';
import { CallStatusEnum } from '../../enum/call.status.enum';

@Entity('call_log_entity')
export class CallLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AlertEntity, (alert) => alert.id)
  @JoinColumn({ name: 'alert_id' })
  alert: AlertEntity;

  @Column({ nullable: true })
  callId: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  calledBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    length: 255,
    nullable: false,
    enum: CallStatusEnum,
  })
  callStatus: CallStatusEnum;

  @Column({ type: 'varchar', length: 255, nullable: true })
  summary: string;
}
