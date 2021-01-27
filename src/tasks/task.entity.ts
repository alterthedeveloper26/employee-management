import { Transform } from 'stream';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskStatus } from './task.task-status.enum';

//Represent table (a table is a class)
//Can be use to create, delete, etc
//Should be created into another module as Repository
//Logic from [service] => Respository
@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @Column()
  userId: number;
}
