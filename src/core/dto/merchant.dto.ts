import { Expose, Transform } from 'class-transformer';
import {
  IsUUID,
  IsString,
  IsDate,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class MerchantDto {
  @Expose()
  @IsUUID()
  id: string;

  @Expose()
  @IsString()
  @IsOptional()
  firstName?: string;

  @Expose()
  @IsString()
  @IsOptional()
  lastName?: string;

  @Expose()
  @IsString()
  @IsOptional()
  email?: string;

  @Expose()
  @IsString()
  @IsOptional()
  phone?: string;

  @Expose()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  signupDate: Date;

  @Expose()
  @IsBoolean()
  isActive: boolean;

  @Expose()
  @IsString()
  @IsOptional()
  businessName?: string;

  @Expose()
  @IsString()
  @IsOptional()
  businessTypeId?: string;

  @Expose()
  @IsString()
  @IsOptional()
  businessType?: string;

  @Expose()
  @IsString()
  @IsOptional()
  merchantPlanName?: string;

  @Expose()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @Expose()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsOptional()
  updatedAt?: Date;
}
