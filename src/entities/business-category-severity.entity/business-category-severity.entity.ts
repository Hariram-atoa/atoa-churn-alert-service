import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum ThresholdTypeEnum {
  GTV = 'GTV',
  TC = 'TC',
}

export enum SeverityTypeEnum {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical',
}

@Entity('business_category_severity_entity')
export class BusinessCategorySeverityEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  businessTypeId: string;

  @Column({ type: 'enum', nullable: false, enum: ThresholdTypeEnum })
  thresholdType: ThresholdTypeEnum;

  @Column({ type: 'enum', nullable: false, enum: SeverityTypeEnum })
  severityType: SeverityTypeEnum;

  @Column({ type: 'int', nullable: false })
  thresholdValue: number;
}
