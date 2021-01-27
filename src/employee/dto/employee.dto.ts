import {
  IsEmail,
  isEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class EmployeeDTO {
  @IsOptional()
  name: string;

  @IsOptional()
  age: number;

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @MinLength(6)
  @MaxLength(20)
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  isAdmin: boolean;

  @IsEmail()
  email: string;
}
