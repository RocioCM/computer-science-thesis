import { Expose } from 'class-transformer';
import {
  IsEthereumAddress,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class Material {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsNumber()
  amount: number;

  @Expose()
  @IsString()
  measureUnit: string;
}

export class Bottle {
  @Expose()
  @IsInt()
  weight: number;

  @Expose()
  @IsString()
  color: string;

  @Expose()
  @IsInt()
  thickness: number;

  @Expose()
  @IsString()
  shapeType: string;

  @Expose()
  @IsString()
  originLocation: string;

  @Expose()
  @IsString()
  extraInfo: string;

  @Expose()
  composition: Material[];
}

export class BaseBottlesBatch {
  @Expose()
  @IsInt()
  id: number;

  @Expose()
  @IsInt()
  quantity: number;

  @Expose()
  bottleType: Bottle;

  @Expose()
  @IsEthereumAddress()
  owner: string;

  @Expose()
  @IsInt()
  soldQuantity: number;

  @Expose()
  @IsOptional()
  @IsString()
  createdAt: string;

  @Expose()
  @IsOptional()
  @IsString()
  deletedAt: string;
}

export class CreateBaseBottlesBatchDTO {
  @Expose()
  @IsInt()
  quantity: number;

  @Expose()
  bottleType: Bottle;

  @Expose()
  @IsString()
  createdAt: string;
}

export type CreationResponse = {
  batchId: number;
};

export class UpdateBaseBottlesBatchDTO extends CreateBaseBottlesBatchDTO {
  @Expose()
  @IsInt()
  id: number;
}

export class SellBaseBottlesDTO {
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
  productBatchId: number;
};

export class RecycleBaseBottlesDTO {
  @Expose()
  @IsInt()
  batchId: number;

  @Expose()
  @IsInt()
  quantity: number;
}
