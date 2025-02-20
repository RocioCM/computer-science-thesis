import { IsInt, IsDateString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Watcher {
  @IsInt()
  @PrimaryGeneratedColumn()
  id: number;

  @IsInt()
  @Column()
  userAccountId: string;

  @IsInt()
  @Column()
  wasteBottleId: number;

  @IsDateString()
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  @IsDateString()
  @Column({ type: 'datetime', nullable: true })
  deletedAt: string;
}
