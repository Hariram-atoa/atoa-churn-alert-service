import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AlertEntity } from '../../entities/alert.entity/alert.entity';
import { CallLogEntity } from '../../entities/call-log.entity/call-log.entity';
import { AlertSeverityEnum } from '../../enum/alert.severity.enum';
import { AlertStatusEnum } from '../../enum/alert.status.enum';
import { AlertTypeEnum } from '../../enum/alert.type.enum';

@Injectable()
export class AlertsRepository {
  constructor(
    @InjectRepository(AlertEntity)
    private readonly alertRepository: Repository<AlertEntity>,
    @InjectRepository(CallLogEntity)
    private readonly callLogRepository: Repository<CallLogEntity>,
  ) {}

  async findWithFilters(
    severity?: AlertSeverityEnum,
    alertType?: AlertTypeEnum,
    assignedToUser?: string,
    fromDate?: string,
    toDate?: string,
    status?: AlertStatusEnum,
    merchantId?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: AlertEntity[]; total: number; stats: any }> {
    const queryBuilder = this.alertRepository.createQueryBuilder('alert');

    // Apply filters
    if (severity) {
      queryBuilder.andWhere('alert.severity = :severity', { severity });
    }

    if (alertType) {
      queryBuilder.andWhere('alert.alertType = :alertType', { alertType });
    }

    if (assignedToUser) {
      queryBuilder.andWhere('alert.assignedToUser = :assignedToUser', {
        assignedToUser,
      });
    }

    if (fromDate) {
      queryBuilder.andWhere('alert.createdAt >= :fromDate', { fromDate });
    }

    if (toDate) {
      queryBuilder.andWhere('alert.createdAt <= :toDate', { toDate });
    }

    if (status) {
      queryBuilder.andWhere('alert.status = :status', { status });
    }

    if (merchantId) {
      queryBuilder.andWhere('alert.merchantId = :merchantId', { merchantId });
    }

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Order by creation date (newest first)
    queryBuilder.orderBy('alert.createdAt', 'DESC');

    const [data, total] = await queryBuilder.getManyAndCount();

    // Calculate stats
    const stats = await this.calculateSeverityStats(
      severity,
      alertType,
      assignedToUser,
      fromDate,
      toDate,
      status,
      merchantId,
    );

    return { data, total, stats };
  }

  async findById(id: string): Promise<AlertEntity | null> {
    return this.alertRepository.findOne({
      where: { id },
    });
  }

  async create(alertData: Partial<AlertEntity>): Promise<AlertEntity> {
    const alert = this.alertRepository.create(alertData);
    return this.alertRepository.save(alert);
  }

  async update(
    id: string,
    alertData: Partial<AlertEntity>,
  ): Promise<AlertEntity | null> {
    await this.alertRepository.update(id, alertData);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    // First, delete all associated call logs
    await this.callLogRepository.delete({ alert: { id } });

    // Then delete the alert
    const result = await this.alertRepository.delete(id);
    return result.affected > 0;
  }

  private async calculateSeverityStats(
    severity?: AlertSeverityEnum,
    alertType?: AlertTypeEnum,
    assignedToUser?: string,
    fromDate?: string,
    toDate?: string,
    status?: AlertStatusEnum,
    merchantId?: string,
  ): Promise<any> {
    const queryBuilder = this.alertRepository.createQueryBuilder('alert');

    // Apply same filters as main query
    if (severity) {
      queryBuilder.andWhere('alert.severity = :severity', { severity });
    }

    if (alertType) {
      queryBuilder.andWhere('alert.alertType = :alertType', { alertType });
    }

    if (assignedToUser) {
      queryBuilder.andWhere('alert.assignedToUser = :assignedToUser', {
        assignedToUser,
      });
    }

    if (fromDate) {
      queryBuilder.andWhere('alert.createdAt >= :fromDate', { fromDate });
    }

    if (toDate) {
      queryBuilder.andWhere('alert.createdAt <= :toDate', { toDate });
    }

    if (status) {
      queryBuilder.andWhere('alert.status = :status', { status });
    }

    if (merchantId) {
      queryBuilder.andWhere('alert.merchantId = :merchantId', { merchantId });
    }

    const stats = await queryBuilder
      .select('alert.severity', 'severity')
      .addSelect('COUNT(*)', 'count')
      .groupBy('alert.severity')
      .getRawMany();

    // Format stats
    const formattedStats = {};
    Object.values(AlertSeverityEnum).forEach((severityValue) => {
      const stat = stats.find((s) => s.severity === severityValue);
      formattedStats[severityValue] = stat ? parseInt(stat.count) : 0;
    });

    return formattedStats;
  }
}
