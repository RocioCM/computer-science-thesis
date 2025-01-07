import { IsInt, IsDateString, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Owners {
  @IsInt()
  @PrimaryGeneratedColumn()
  id: number;

  @IsInt()
  @Column()
  bottleIndex: number;

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
