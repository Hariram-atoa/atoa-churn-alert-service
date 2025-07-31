import { Injectable } from '@nestjs/common';
import { CoreRepository } from '../core/core.repository';
import { CORE_QUERIES } from '../core/raw-queries/core.queries';
import { MerchantDto } from './dto/merchant.dto';
import {
  MerchantMapperService,
  RawMerchantData,
} from './services/merchant-mapper.service';

@Injectable()
export class CoreService {
  constructor(
    private readonly coreRepository: CoreRepository,
    private readonly merchantMapperService: MerchantMapperService,
  ) {}

  // Core business logic methods
  async getBulkMerchantByIds(merchantIds: string[]): Promise<MerchantDto[]> {
    const rawMerchants = await this.coreRepository.executeRawQuery(
      CORE_QUERIES.GET_BULK_MERCHANT_BY_IDS,
      [merchantIds],
    );

    // Handle both single object and array cases
    const merchantsArray = Array.isArray(rawMerchants)
      ? rawMerchants
      : [rawMerchants];

    return this.merchantMapperService.mapToMerchantDtoArray(
      merchantsArray as RawMerchantData[],
    );
  }

  // Core business logic methods
  async getMerchantById(merchantId: string): Promise<MerchantDto | null> {
    const rawMerchant = await this.coreRepository.executeRawQuery(
      CORE_QUERIES.GET_MERCHANT_BY_ID,
      [merchantId],
    );

    if (
      !rawMerchant ||
      (Array.isArray(rawMerchant) && rawMerchant.length === 0)
    ) {
      return null;
    }

    const merchantData = Array.isArray(rawMerchant)
      ? rawMerchant[0]
      : rawMerchant;
    return this.merchantMapperService.mapToMerchantDto(
      merchantData as RawMerchantData,
    );
  }
}
