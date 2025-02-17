import { Expose } from 'class-transformer';
import {
  IsInt,
  IsString,
  IsEmail,
  IsOptional,
  IsNumberString,
} from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
// @AutoExpose
export class User {
  @Expose()
  @IsInt()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @IsString()
  @Column({ unique: true })
  firebaseUid: string;

  @Expose()
  @IsEmail()
  @Column()
  email: string;

  @Expose()
  @IsString()
  @Column({ unique: true })
  blockchainId: string;

  @Expose()
  @IsString()
  @IsOptional()
  @Column({ default: '' })
  userName?: string;

  @Expose()
  @IsString()
  @IsOptional()
  @Column({ default: '' })
  managerName?: string;

  @Expose()
  @IsOptional()
  @IsNumberString()
  @Column({ default: '' })
  phone?: string;
}

export class CreateUserDTO {
  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @IsString()
  password: string;

  @Expose()
  @IsInt()
  roleId: number;
}

export class UpdateUserDTO {
  @Expose()
  @IsOptional()
  @IsString()
  userName?: string;

  @Expose()
  @IsOptional()
  @IsString()
  managerName?: string;

  @Expose()
  @IsOptional()
  @IsNumberString()
  phone?: string;
}
