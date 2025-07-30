import { IsOptional, IsString, IsUUID, IsObject } from 'class-validator';

export class UpdateAlertAssignmentDto {
  @IsOptional()
  @IsUUID()
  assignedToUser?: string;

  @IsOptional()
  @IsObject()
  comment?: {
    fromUser: string;
    toUser: string;
    comment: string;
  };
}
