import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsObject,
} from 'class-validator';
import { AlertSeverityEnum } from '../../enum/alert.severity.enum';

export class CreateAlertDto {
  @IsEnum(AlertSeverityEnum)
  @IsNotEmpty()
  severity: AlertSeverityEnum;

  @IsUUID()
  @IsNotEmpty()
  merchantId: string;

  @IsOptional()
  @IsObject()
  summary?: {
    [key: string]: any;
  };

  @IsOptional()
  @IsString()
  followUpReason?: string;
}
