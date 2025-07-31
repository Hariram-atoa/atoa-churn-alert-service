import { AlertSeverityEnum } from '../../enum/alert.severity.enum';
import { AlertStatusEnum } from '../../enum/alert.status.enum';
import { AlertTypeEnum } from '../../enum/alert.type.enum';
import { MerchantDto } from '../../core/dto/merchant.dto';

export class AlertResponseDto {
  id: string;
  severity: AlertSeverityEnum;
  merchantId: string;
  alertType: AlertTypeEnum;
  assignedToUser?: string;
  summary?: {
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
  status: AlertStatusEnum;
  followUpDate?: Date;
  followUpReason?: string;
  comments?: {
    fromUser: string;
    toUser: string;
    comment: string;
  }[];
  merchant?: MerchantDto;
}

export class AlertWithCallLogsResponseDto extends AlertResponseDto {
  callLogs?: {
    id: string;
    calledBy: string;
    callStatus: string;
    callId?: string;
    summary?: string;
    createdAt: Date;
  }[];
}

export class SearchAlertsResponseDto {
  data: AlertResponseDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  stats: {
    [key in AlertSeverityEnum]: number;
  };
}
