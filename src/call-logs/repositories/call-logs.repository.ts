import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CallLogEntity } from '../../entities/call-log.entity/call-log.entity';
import { CallStatusEnum } from '../../enum/call.status.enum';

@Injectable()
export class CallLogsRepository {
  constructor(
    @InjectRepository(CallLogEntity)
    private readonly callLogRepository: Repository<CallLogEntity>,
  ) {}

  async findWithFilters(
    calledBy?: string,
    fromDate?: string,
    toDate?: string,
    callStatus?: CallStatusEnum,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: CallLogEntity[]; total: number }> {
    const queryBuilder = this.callLogRepository
      .createQueryBuilder('callLog')
      .leftJoinAndSelect('callLog.alert', 'alert');

    // Apply filters
    if (calledBy) {
      queryBuilder.andWhere('callLog.calledBy = :calledBy', { calledBy });
    }

    if (fromDate) {
      queryBuilder.andWhere('callLog.createdAt >= :fromDate', { fromDate });
    }

    if (toDate) {
      queryBuilder.andWhere('callLog.createdAt <= :toDate', { toDate });
    }

    if (callStatus) {
      queryBuilder.andWhere('callLog.callStatus = :callStatus', { callStatus });
    }

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Order by creation date (newest first)
    queryBuilder.orderBy('callLog.createdAt', 'DESC');

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  async findByAlertId(alertId: string): Promise<CallLogEntity[]> {
    return this.callLogRepository.find({
      where: { alert: { id: alertId } },
      relations: ['alert'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<CallLogEntity | null> {
    return this.callLogRepository.findOne({
      where: { id },
      relations: ['alert'],
    });
  }

  async create(callLogData: Partial<CallLogEntity>): Promise<CallLogEntity> {
    const callLog = this.callLogRepository.create(callLogData);
    return this.callLogRepository.save(callLog);
  }

  async update(
    id: string,
    callLogData: Partial<CallLogEntity>,
  ): Promise<CallLogEntity | null> {
    await this.callLogRepository.update(id, callLogData);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.callLogRepository.delete(id);
    return result.affected > 0;
  }
}
