import { IsInt, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role {
  @IsInt()
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column({ unique: true })
  name: string;
}
