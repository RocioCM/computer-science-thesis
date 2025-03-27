import { Expose } from 'class-transformer';
import {
  IsEthereumAddress,
  IsInt,
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
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

export class RecycledMaterialBatch {
  @Expose()
  @IsInt()
  id: number;

  @Expose()
  @IsInt()
  weight: number;

  @Expose()
  @IsString()
  size: string;

  @Expose()
  @IsString()
  materialType: string;

  @Expose()
  composition: Material[];

  @Expose()
  @IsString()
  extraInfo: string;

  @Expose()
  @IsEthereumAddress()
  buyerOwner: string;

  @Expose()
  @IsEthereumAddress()
  creator: string;

  @Expose()
  @IsArray()
  @IsInt({ each: true })
  wasteBottleIds: number[];

  @Expose()
  @IsOptional()
  @IsString()
  createdAt: string;

  @Expose()
  @IsOptional()
  @IsString()
  deletedAt: string;
}

export class CreateRecyclingBatchDTO {
  @Expose()
  @IsInt()
  weight: number;

  @Expose()
  @IsString()
  size: string;

  @Expose()
  @IsString()
  materialType: string;

  @Expose()
  composition: Material[];

  @Expose()
  @IsString()
  extraInfo: string;

  @Expose()
  @IsArray()
  @IsInt({ each: true })
  wasteBottleIds: number[];
}

export type CreateResponse = {
  batchId: number;
};

export class UpdateRecyclingBatchDTO {
  @Expose()
  @IsInt()
  id: number;

  @Expose()
  @IsInt()
  weight: number;

  @Expose()
  @IsString()
  size: string;

  @Expose()
  @IsString()
  materialType: string;

  @Expose()
  composition: Material[];

  @Expose()
  @IsString()
  extraInfo: string;

  @Expose()
  @IsArray()
  @IsInt({ each: true })
  wasteBottleIds: number[];
}

export class SellRecyclingBatchDTO {
  @Expose()
  @IsInt()
  batchId: number;

  @Expose()
  @IsString()
  buyerUid: string;
}
