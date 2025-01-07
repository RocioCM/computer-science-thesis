import {
  IsInt,
  IsString,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @IsInt()
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column({ unique: true })
  firebaseUid: string;

  @IsInt()
  @Column()
  roleId: number;

  @IsEmail()
  @Column()
  email: string;

  @IsString()
  @Column({ unique: true })
  blockchainId: string;

  @IsString()
  @IsOptional()
  @Column({ default: '' })
  userName?: string;

  @IsString()
  @IsOptional()
  @Column({ default: '' })
  managerName?: string;

  @IsOptional()
  @IsPhoneNumber()
  @Column({ default: '' })
  phone?: string;
}
