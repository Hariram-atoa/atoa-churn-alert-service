import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AlertStatusEnum } from '../../enum/alert.status.enum';
import { CallStatusEnum } from '../../enum/call.status.enum';

export class UpdateAlertStatusDto {
  @IsEnum(AlertStatusEnum)
  @IsNotEmpty()
  status: AlertStatusEnum;

  @IsOptional()
  @IsString()
  followUpReason?: string;

  // Call log data (required when status is RESOLVED)
  @IsOptional()
  callLog?: {
    followUpDate?: Date;
    calledBy: string;
    callId?: string;
    callStatus: CallStatusEnum;
    summary?: string;
  };
}
