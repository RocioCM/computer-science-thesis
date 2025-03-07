import { Expose } from 'class-transformer';
import {
  IsEthereumAddress,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class WasteBottle {
  @Expose()
  @IsInt()
  id: number;

  @Expose()
  @IsString()
  trackingCode: string;

  @Expose()
  @IsEthereumAddress()
  owner: string;

  @Expose()
  @IsEthereumAddress()
  creator: string;

  @Expose()
  @IsInt()
  recycledBatchId: number;

  @Expose()
  @IsOptional()
  @IsString()
  createdAt: string;

  @Expose()
  @IsOptional()
  @IsString()
  deletedAt: string;
}

export class CreateWasteBottleDTO {
  @Expose()
  @IsString()
  trackingCode: string;

  @Expose()
  @IsString()
  owner: string;
}

export type CreationResponse = {
  bottleId: number;
};

export type TrackingOriginResponse = {
  stage: string;
  data: any;
}[];

export type TrackingRecyclingResponse = {
  stage: string;
  data: any;
}[];
