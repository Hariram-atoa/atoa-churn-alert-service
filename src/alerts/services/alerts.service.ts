import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AlertsRepository } from '../repositories/alerts.repository';
import { CallLogsRepository } from '../../call-logs/repositories/call-logs.repository';
import { AlertEntity } from '../../entities/alert.entity/alert.entity';
import { CallLogEntity } from '../../entities/call-log.entity/call-log.entity';
import { CreateAlertDto } from '../dto/create-alert.dto';
import { UpdateAlertStatusDto } from '../dto/update-alert-status.dto';
import { UpdateAlertAssignmentDto } from '../dto/update-alert-assignment.dto';
import { SearchAlertsDto } from '../dto/search-alerts.dto';
import { AlertSeverityEnum } from '../../enum/alert.severity.enum';
import { AlertStatusEnum } from '../../enum/alert.status.enum';
import { AlertTypeEnum } from '../../enum/alert.type.enum';
import { CallStatusEnum } from '../../enum/call.status.enum';

@Injectable()
export class AlertsService {
  constructor(
    private readonly alertsRepository: AlertsRepository,
    private readonly callLogsRepository: CallLogsRepository,
  ) {}

  async createAlert(createAlertDto: CreateAlertDto): Promise<AlertEntity> {
    // Validate required fields
    if (!createAlertDto.severity) {
      throw new BadRequestException('Severity is required');
    }

    if (!createAlertDto.merchantId) {
      throw new BadRequestException('Merchant ID is required');
    }

    if (!createAlertDto.alertType) {
      throw new BadRequestException('Alert type is required');
    }

    // Validate severity enum
    if (!Object.values(AlertSeverityEnum).includes(createAlertDto.severity)) {
      throw new BadRequestException('Invalid severity level');
    }

    // Validate alert type enum
    if (!Object.values(AlertTypeEnum).includes(createAlertDto.alertType)) {
      throw new BadRequestException('Invalid alert type');
    }

    // Set default status to OPEN
    const alertData: Partial<AlertEntity> = {
      severity: createAlertDto.severity,
      merchantId: createAlertDto.merchantId,
      alertType: createAlertDto.alertType,
      assignedToUser: createAlertDto.assignedToUser,
      summary: createAlertDto.summary,
      followUpReason: createAlertDto.followUpReason,
      status: AlertStatusEnum.OPEN,
    };

    // Handle comment - initialize comments array if comment is provided
    if (createAlertDto.comment) {
      alertData.comments = [createAlertDto.comment];
    }

    return this.alertsRepository.create(alertData);
  }

  async updateAlertStatus(
    id: string,
    updateAlertStatusDto: UpdateAlertStatusDto,
  ): Promise<{ alert: AlertEntity; callLog?: CallLogEntity }> {
    // Check if alert exists
    const existingAlert = await this.alertsRepository.findById(id);
    if (!existingAlert) {
      throw new NotFoundException(`Alert with ID ${id} not found`);
    }

    const { status, followUpReason, callLog } = updateAlertStatusDto;

    // Validate status enum
    if (!Object.values(AlertStatusEnum).includes(status)) {
      throw new BadRequestException('Invalid status');
    }

    // If status is RESOLVED, call log data is required
    if (status === AlertStatusEnum.RESOLVED && !callLog) {
      throw new BadRequestException(
        'Call log data is required when status is RESOLVED',
      );
    }

    // Update alert
    const updateData: Partial<AlertEntity> = {
      status,
      followUpReason,
    };

    const updatedAlert = await this.alertsRepository.update(id, updateData);
    if (!updatedAlert) {
      throw new NotFoundException(`Failed to update alert with ID ${id}`);
    }

    let createdCallLog: CallLogEntity | undefined;

    // Create call log if status is RESOLVED
    if (status === AlertStatusEnum.RESOLVED && callLog) {
      // Validate call log data
      if (!callLog.calledBy) {
        throw new BadRequestException('calledBy is required in call log data');
      }

      if (!callLog.callStatus) {
        throw new BadRequestException(
          'callStatus is required in call log data',
        );
      }

      // Validate call status enum
      if (!Object.values(CallStatusEnum).includes(callLog.callStatus)) {
        throw new BadRequestException('Invalid call status');
      }

      // Create call log
      const callLogData: Partial<CallLogEntity> = {
        alert: updatedAlert,
        calledBy: callLog.calledBy,
        callStatus: callLog.callStatus,
        callId: callLog.callId,
        summary: callLog.summary,
      };

      createdCallLog = await this.callLogsRepository.create(callLogData);
    }

    return {
      alert: updatedAlert,
      callLog: createdCallLog,
    };
  }

  async updateAlertAssignment(
    id: string,
    updateAlertAssignmentDto: UpdateAlertAssignmentDto,
  ): Promise<AlertEntity> {
    // Check if alert exists
    const existingAlert = await this.alertsRepository.findById(id);
    if (!existingAlert) {
      throw new NotFoundException(`Alert with ID ${id} not found`);
    }

    const { assignedToUser, comment } = updateAlertAssignmentDto;

    // Update alert
    const updateData: Partial<AlertEntity> = {};

    if (assignedToUser !== undefined) {
      updateData.assignedToUser = assignedToUser;
    }

    if (comment !== undefined) {
      // Initialize comments array if it doesn't exist, or append to existing array
      const existingComments = existingAlert.comments || [];
      updateData.comments = [...existingComments, comment];
    }

    const updatedAlert = await this.alertsRepository.update(id, updateData);
    if (!updatedAlert) {
      throw new NotFoundException(`Failed to update alert with ID ${id}`);
    }

    return updatedAlert;
  }

  async searchAlerts(filters: SearchAlertsDto) {
    const {
      severity,
      alertType,
      assignedToUser,
      fromDate,
      toDate,
      status,
      merchantId,
      page,
      limit,
    } = filters;

    // Validate date range if both dates are provided
    if (fromDate && toDate) {
      const fromDateObj = new Date(fromDate);
      const toDateObj = new Date(toDate);

      if (fromDateObj > toDateObj) {
        const ref = fromDate;
        const from = toDate;
        const to = ref;
        // Swap dates
        filters.fromDate = from;
        filters.toDate = to;
      }
    }

    const result = await this.alertsRepository.findWithFilters(
      severity,
      alertType,
      assignedToUser,
      filters.fromDate,
      filters.toDate,
      status,
      merchantId,
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
      stats: result.stats,
    };
  }

  async getAlertById(
    id: string,
  ): Promise<{ alert: AlertEntity; callLogs: CallLogEntity[] }> {
    if (!id) {
      throw new BadRequestException('Alert ID is required');
    }

    const alert = await this.alertsRepository.findById(id);
    if (!alert) {
      throw new NotFoundException(`Alert with ID ${id} not found`);
    }

    // Get associated call logs
    const callLogs = await this.callLogsRepository.findByAlertId(id);

    return {
      alert,
      callLogs,
    };
  }

  async deleteAlert(id: string): Promise<{ message: string }> {
    // Check if alert exists
    const existingAlert = await this.alertsRepository.findById(id);
    if (!existingAlert) {
      throw new NotFoundException(`Alert with ID ${id} not found`);
    }

    const deleted = await this.alertsRepository.delete(id);
    if (!deleted) {
      throw new BadRequestException(`Failed to delete alert with ID ${id}`);
    }

    return { message: `Alert with ID ${id} deleted successfully` };
  }
}
