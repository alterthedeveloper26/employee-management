import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude, Expose } from 'class-transformer';

@Entity()
@Unique(['username'])
export class Employee extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Column()
  isAdmin: boolean;

  @Column()
  salt: string;

  @Column()
  email: string;

  @Expose()
  getFullName(): string {
    const full = `${this.name} ${this.age}`;
    return full;
  }

  async validatePassword(pass: string): Promise<boolean> {
    const tempPassword = await bcrypt.hash(pass, this.salt);
    return this.password === tempPassword;
  }

  // async validatePassword(testPassword: string): Promise<boolean> {
  //   const hashTestPassword = await bcrypt.hash(testPassword, this.salt);
  //   return this.password === hashTestPassword;
  // }
}
