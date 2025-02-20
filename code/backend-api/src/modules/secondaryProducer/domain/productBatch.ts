import { Expose } from 'class-transformer';
import {
  IsEthereumAddress,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class ProductBottlesBatch {
  @Expose()
  @IsInt()
  id: number;

  @Expose()
  @IsInt()
  quantity: number;

  @Expose()
  @IsInt()
  availableQuantity: number;

  @Expose()
  @IsInt()
  originBaseBatchId: number;

  @Expose()
  @IsString()
  trackingCode: string;

  @Expose()
  @IsEthereumAddress()
  owner: string;

  @Expose()
  @IsOptional()
  @IsString()
  createdAt: string;

  @Expose()
  @IsOptional()
  @IsString()
  deletedAt: string;
}

export class SoldProductBatch {
  @Expose()
  @IsInt()
  id: number;

  @Expose()
  @IsInt()
  quantity: number;

  @Expose()
  @IsInt()
  originProductBatchId: number;

  @Expose()
  @IsEthereumAddress()
  owner: string;

  @Expose()
  @IsOptional()
  @IsString()
  createdAt: string;
}

export class UpdateTrackingCodeDTO {
  @Expose()
  @IsInt()
  id: number;

  @Expose()
  @IsString()
  trackingCode: string;
}

export class RecycleBaseBottlesDTO {
  @Expose()
  @IsInt()
  productBatchId: number;

  @Expose()
  @IsInt()
  quantity: number;
}

export class SellProductBottlesDTO {
  @Expose()
  @IsInt()
  batchId: number;

  @Expose()
  @IsInt()
  quantity: number;

  @Expose()
  @IsInt()
  buyerUid: string;
}

export type SellResponse = {
  soldProductId: number;
};
