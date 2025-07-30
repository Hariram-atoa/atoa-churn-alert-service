import {
  IsEnum,
  IsOptional,
  IsDateString,
  IsNumber,
  Min,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AlertSeverityEnum } from '../../enum/alert.severity.enum';
import { AlertStatusEnum } from '../../enum/alert.status.enum';
import { AlertTypeEnum } from '../../enum/alert.type.enum';

export class SearchAlertsDto {
  @IsOptional()
  @IsEnum(AlertSeverityEnum)
  severity?: AlertSeverityEnum;

  @IsOptional()
  @IsEnum(AlertTypeEnum)
  alertType?: AlertTypeEnum;

  @IsOptional()
  @IsUUID()
  assignedToUser?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;

  @IsOptional()
  @IsEnum(AlertStatusEnum)
  status?: AlertStatusEnum;

  @IsOptional()
  @IsUUID()
  merchantId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
