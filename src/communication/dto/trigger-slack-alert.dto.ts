import { IsNotEmpty, IsString } from 'class-validator';

export class TriggerSlackAlertDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}
