import { extname } from 'path';
import { Employee } from './emloyee.entity';
import { EntityRepository, Repository } from 'typeorm';
import { EmployeeDTO } from './dto/employee.dto';
import * as bcrypt from 'bcrypt';
import e, { json } from 'express';
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { exception } from 'console';
import { SearchEmpDTO } from './dto/search-emp.dto';
import { UpdateEmployeeDTO } from './dto/update-employee.dto';
import { SignInDTO } from './dto/signIn-employee.dto';

@EntityRepository(Employee)
export class EmployeeRepository extends Repository<Employee> {
  private logger = new Logger('EmployeeRepository');

  async createEmployee(dto: EmployeeDTO): Promise<Employee> {
    const { age, name, username, password, isAdmin, email } = dto;

    const salt = await bcrypt.genSalt();

    const employee = new Employee();
    employee.age = age;
    employee.name = name;
    employee.username = username;
    employee.password = await this.hashPassword(password, salt);
    employee.isAdmin = isAdmin;
    employee.salt = salt;
    employee.email = email;

    try {
      await employee.save();
    } catch (error) {
      //   console.log('Met vai l....');
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Duplicated username');
      } else {
        throw new InternalServerErrorException('Error creating employee');
      }
    }

    return employee;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    const encryptedPass = await bcrypt.hash(password, salt);
    return encryptedPass;
  }

  async validateUserPassword(dto: SignInDTO): Promise<Employee> {
    let user;
    try {
      const { username, password } = dto;
      user = await this.findOne({ username });

      const validated = await user.validatePassword(password);

      if (user && validated) {
        return user;
      } else {
        return null;
      }
    } catch (error) {
      this.logger.error(error.stack);
      throw new InternalServerErrorException(
        'Error while validate User & Password',
      );
    }
  }

  async getEmployees(dto: SearchEmpDTO, admin: Employee): Promise<Employee[]> {
    if (!admin.isAdmin) {
      throw new ConflictException('You are not authorized!');
    }

    const { search, isAdmin } = dto;

    const query = this.createQueryBuilder('employee');

    if (isAdmin) {
      this.logger.debug(`has adopted isAdmin : ${isAdmin}`);
      query.where('employee.isAdmin = :isAdmin', { isAdmin: isAdmin });
    }

    if (search) {
      query.andWhere('employee.name LIKE :search', {
        search: `%${search}%`,
      });
    }

    try {
      const emps = await query.getMany();
      return emps;
    } catch (error) {
      this.logger.error(
        `Fail to get employees that ${JSON.stringify(dto)}`,
        error.stack,
      );
    }
  }
}
