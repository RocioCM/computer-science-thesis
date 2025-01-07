import { IsInt, IsDateString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Watchers {
  @IsInt()
  @PrimaryGeneratedColumn()
  id: number;

  @IsInt()
  @Column()
  userId: number;

  @IsInt()
  @Column()
  wasteBottleIndex: number;

  @IsDateString()
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  @IsDateString()
  @Column({ type: 'datetime', nullable: true })
  deletedAt: string;
}
