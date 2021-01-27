import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateEmployeeDTO {
  name: string;
  age: number;

  @MaxLength(20)
  @MinLength(6)
  @IsOptional()
  password: string;
}
