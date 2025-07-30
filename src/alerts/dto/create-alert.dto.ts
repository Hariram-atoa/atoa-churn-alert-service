import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsObject,
} from 'class-validator';
import { AlertSeverityEnum } from '../../enum/alert.severity.enum';
import { AlertTypeEnum } from '../../enum/alert.type.enum';

export class CreateAlertDto {
  @IsEnum(AlertSeverityEnum)
  @IsNotEmpty()
  severity: AlertSeverityEnum;

  @IsUUID()
  @IsNotEmpty()
  merchantId: string;

  @IsEnum(AlertTypeEnum)
  @IsNotEmpty()
  alertType: AlertTypeEnum;

  @IsOptional()
  @IsUUID()
  assignedToUser?: string;

  @IsOptional()
  @IsObject()
  summary?: {
    [key: string]: any;
  };

  @IsOptional()
  @IsString()
  followUpReason?: string;

  @IsOptional()
  @IsObject()
  comment?: {
    fromUser: string;
    toUser: string;
    comment: string;
  };
}
