import {
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
  Min,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AlertSeverityEnum } from '../../enum/alert.severity.enum';
import { AlertStatusEnum } from '../../enum/alert.status.enum';

export class SearchAlertsDto {
  @IsOptional()
  @IsEnum(AlertSeverityEnum)
  severity?: AlertSeverityEnum;

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
