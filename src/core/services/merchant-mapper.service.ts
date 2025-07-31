import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { MerchantDto } from '../dto/merchant.dto';

export interface RawMerchantData {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  signupDate: string | Date;
  isActive: boolean;
  businessName?: string;
  businessTypeId?: string;
  businessType?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

@Injectable()
export class MerchantMapperService {
  /**
   * Maps raw database result to MerchantDto
   */
  mapToMerchantDto(rawData: RawMerchantData): MerchantDto {
    return plainToClass(MerchantDto, {
      id: rawData.id,
      firstName: rawData.firstName || undefined,
      lastName: rawData.lastName || undefined,
      email: rawData.email || undefined,
      phone: rawData.phone || undefined,
      signupDate: rawData.signupDate,
      isActive: rawData.isActive,
      businessName: rawData.businessName || undefined,
      businessTypeId: rawData.businessTypeId || undefined,
      businessType: rawData.businessType || undefined,
      createdAt: rawData.createdAt || undefined,
      updatedAt: rawData.updatedAt || undefined,
    });
  }

  /**
   * Maps array of raw database results to array of MerchantDto
   */
  mapToMerchantDtoArray(rawDataArray: RawMerchantData[]): MerchantDto[] {
    return rawDataArray.map((rawData) => this.mapToMerchantDto(rawData));
  }
}
