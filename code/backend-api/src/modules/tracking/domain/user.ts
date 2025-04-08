import { Expose } from 'class-transformer';
import { IsEmail, IsNumberString, IsOptional, IsString } from 'class-validator';

export class UserPublicProfileDTO {
  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @IsString()
  blockchainId: string;

  @Expose()
  @IsString()
  @IsOptional()
  userName?: string;

  @Expose()
  @IsOptional()
  @IsNumberString()
  phone?: string;
}
