import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CallLogsRepository } from '../repositories/call-logs.repository';
import { CallLogEntity } from '../../entities/call-log.entity/call-log.entity';
import { GetCallLogsDto } from '../dto/get-call-logs.dto';
import { CallStatusEnum } from '../../enum/call.status.enum';

@Injectable()
export class CallLogsService {
  constructor(private readonly callLogsRepository: CallLogsRepository) {}

  async getCallLogsWithFilters(filters: GetCallLogsDto) {
    const { calledBy, fromDate, toDate, callStatus, page, limit } = filters;
    let from = fromDate;
    let to = toDate;

    // Validate date range if both dates are provided
    if (fromDate && toDate) {
      const fromDateObj = new Date(fromDate);
      const toDateObj = new Date(toDate);

      if (fromDateObj > toDateObj) {
        const ref = from;
        from = to;
        to = ref;
      }
    }

    const result = await this.callLogsRepository.findWithFilters(
      calledBy,
      fromDate,
      toDate,
      callStatus,
      page,
      limit,
    );

    return {
      data: result.data,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
        hasNext: page * limit < result.total,
        hasPrev: page > 1,
      },
    };
  }

  async getCallLogsByAlertId(alertId: string): Promise<CallLogEntity[]> {
    if (!alertId) {
      throw new BadRequestException('alertId is required');
    }

    const callLogs = await this.callLogsRepository.findByAlertId(alertId);

    if (callLogs.length === 0) {
      throw new NotFoundException(
        `No call logs found for alert ID: ${alertId}`,
      );
    }

    return callLogs;
  }

  async getCallLogById(id: string): Promise<CallLogEntity> {
    if (!id) {
      throw new BadRequestException('Call log ID is required');
    }

    const callLog = await this.callLogsRepository.findById(id);

    if (!callLog) {
      throw new NotFoundException(`Call log with ID ${id} not found`);
    }

    return callLog;
  }

  async createCallLog(
    callLogData: Partial<CallLogEntity>,
  ): Promise<CallLogEntity> {
    // Validate required fields
    if (!callLogData.calledBy) {
      throw new BadRequestException('calledBy is required');
    }

    if (!callLogData.callStatus) {
      throw new BadRequestException('callStatus is required');
    }

    // Validate call status enum
    if (!Object.values(CallStatusEnum).includes(callLogData.callStatus)) {
      throw new BadRequestException('Invalid call status');
    }

    return this.callLogsRepository.create(callLogData);
  }

  async updateCallLog(
    id: string,
    callLogData: Partial<CallLogEntity>,
  ): Promise<CallLogEntity> {
    // Check if call log exists
    const existingCallLog = await this.callLogsRepository.findById(id);
    if (!existingCallLog) {
      throw new NotFoundException(`Call log with ID ${id} not found`);
    }

    // Validate call status if provided
    if (
      callLogData.callStatus &&
      !Object.values(CallStatusEnum).includes(callLogData.callStatus)
    ) {
      throw new BadRequestException('Invalid call status');
    }

    const updatedCallLog = await this.callLogsRepository.update(
      id,
      callLogData,
    );
    if (!updatedCallLog) {
      throw new NotFoundException(`Failed to update call log with ID ${id}`);
    }

    return updatedCallLog;
  }

  async deleteCallLog(id: string): Promise<{ message: string }> {
    // Check if call log exists
    const existingCallLog = await this.callLogsRepository.findById(id);
    if (!existingCallLog) {
      throw new NotFoundException(`Call log with ID ${id} not found`);
    }

    const deleted = await this.callLogsRepository.delete(id);
    if (!deleted) {
      throw new BadRequestException(`Failed to delete call log with ID ${id}`);
    }

    return { message: `Call log with ID ${id} deleted successfully` };
  }
}
