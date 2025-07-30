import { Injectable } from '@nestjs/common';
import { CoreRepository } from '../core/core.repository';
import { CORE_QUERIES } from '../core/raw-queries/core.queries';
import { plainToInstance } from 'class-transformer';
import { MerchantDto } from './dto/merchant.dto';

@Injectable()
export class CoreService {
  constructor(private readonly coreRepository: CoreRepository) {}

  // Core business logic methods
  async getMerchantById(merchantId: string): Promise<any> {
    return this.coreRepository.executeRawQuery(
      CORE_QUERIES.GET_MERCHANT_BY_ID,
      [merchantId],
    );
  }

  async getMerchantsBySignupDay(signupDay: number): Promise<MerchantDto[]> {
    const rawMerchants = await this.coreRepository.executeRawQuery(
      CORE_QUERIES.GET_MERCHANTS_BY_SIGNUP_DAY,
      [signupDay],
    );

    // Transform raw data to DTO using class-transformer
    // Handle both single object and array cases
    const merchantsArray = Array.isArray(rawMerchants)
      ? rawMerchants
      : [rawMerchants];
    return plainToInstance(MerchantDto, merchantsArray, {
      excludeExtraneousValues: true,
    });
  }

  async getMerchantsForFirstDayOfMonth(): Promise<MerchantDto[]> {
    const rawMerchants = await this.coreRepository.executeRawQuery(
      CORE_QUERIES.GET_MERCHANTS_FOR_FIRST_DAY_OF_MONTH,
      [],
    );

    // Transform raw data to DTO using class-transformer
    // Handle both single object and array cases
    const merchantsArray = Array.isArray(rawMerchants)
      ? rawMerchants
      : [rawMerchants];
    return plainToInstance(MerchantDto, merchantsArray, {
      excludeExtraneousValues: true,
    });
  }
}
