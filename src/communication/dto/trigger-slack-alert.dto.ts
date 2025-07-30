import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SlackAlertLevel } from '../enums/slack-alert-level.enum';

export class TriggerSlackAlertDto {
  @IsEnum(SlackAlertLevel)
  @IsNotEmpty()
  alertLevel: SlackAlertLevel;

  @IsString()
  @IsNotEmpty()
  businessName: string;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsString()
  @IsNotEmpty()
  summary: string;
}
