import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeRepository } from './employee.repository';
import { JwtService } from '@nestjs/jwt';
import { EmployeeDTO } from './dto/employee.dto';
import { async } from 'rxjs';
import { JwtPayLoad } from './jwt/jwt.payload';
import { Employee } from './emloyee.entity';
import { SearchEmpDTO } from './dto/search-emp.dto';
import { UpdateEmployeeDTO } from './dto/update-employee.dto';
import { SignInDTO } from './dto/signIn-employee.dto';
@Injectable()
export class EmployeeService {
  private logger = new Logger('EmployeeService');

  constructor(
    @InjectRepository(EmployeeRepository)
    private employeeRepository: EmployeeRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(dto: EmployeeDTO): Promise<Employee> {
    return await this.employeeRepository.createEmployee(dto);
  }

  async signIn(dto: SignInDTO): Promise<{ accessToken: string }> {
    const user: Employee = await this.employeeRepository.validateUserPassword(
      dto,
    );

    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }

    const { username, isAdmin } = user;

    //Hash the payload and sign with secret
    //Anh met roi
    const payload: JwtPayLoad = { username, isAdmin };
    const accessToken = await this.jwtService.sign(payload);

    console.log('------------nv----------------');

    return { accessToken };
  }

  async searchEmployees(
    dto: SearchEmpDTO,
    admin: Employee,
  ): Promise<Employee[]> {
    return this.employeeRepository.getEmployees(dto, admin);
  }

  async deleteEmployee(id: number, employee: Employee) {
    this.logger.debug(`Start debugging`);
    if (!employee.isAdmin) {
      throw new UnauthorizedException('You are not authorized!');
    }

    const emp = await this.getEmployeeById(id);
    this.logger.debug(`employee get del: ${emp}`);

    if (emp.isAdmin) {
      throw new ConflictException('Can not delete an Admin');
    }

    let result;

    result = await this.employeeRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(
        'Employee with such id is not found and that is that!',
      );
    }

    this.logger.verbose(`${JSON.stringify(emp)} is deleted from db`);
  }

  async getEmployeeById(id: number) {
    const found = await this.employeeRepository.findOne({
      where: { id },
    });

    if (!found) {
      throw new NotFoundException(
        `Such employee with id:${id} doesn't exist!!!`,
      );
    }

    return found;
  }

  //test expose properties
  async getFullnageById(id: number) {
    const found = await this.employeeRepository.findOne({
      where: { id },
    });

    if (!found) {
      throw new NotFoundException(
        `Such employee with id:${id} doesn't exist!!!`,
      );
    }

    return found.getFullName;
  }

  async updateOwnInfo(updateDTO: UpdateEmployeeDTO, emp: Employee) {
    const { name, age, password } = updateDTO;

    if (name) {
      emp.name = name;
    }
    if (age) {
      emp.age = age;
    }
    if (password) {
      emp.password = password;
    }

    try {
      await emp.save();
      this.logger.verbose(`User update information: ${JSON.stringify(emp)}`);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Exception when update Info');
    }
  }
}
