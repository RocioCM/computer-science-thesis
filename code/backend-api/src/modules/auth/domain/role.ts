import { Expose } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('role')
export class Role {
  @Expose()
  @IsInt()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @IsString()
  @Column({ unique: true })
  name: string;
}
