import { IsInt, IsDateString, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Ownership {
  @IsInt()
  @PrimaryGeneratedColumn()
  id: number;

  @IsInt()
  @Column()
  bottleId: number;

  @IsInt()
  @Column()
  originBatchId: number;

  @IsString()
  @Column()
  ownerAccountId: string;

  @IsString()
  @Column()
  type: string;

  @IsDateString()
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  @IsDateString()
  @Column({ type: 'datetime', nullable: true })
  deletedAt: string;
}

export class CreateOwnershipDTO {
  @IsInt()
  bottleId: number;

  @IsString()
  ownerAccountId: string;

  @IsString()
  type: string;
}
