import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthGuard } from '@nestjs/passport';
import { userInfo } from 'os';
import { getEmployee } from './decorator/getEmployee.decorator';
import { EmployeeDTO } from './dto/employee.dto';
import { NoticeMailDTO } from './dto/notice-mail.dto';
import { SearchEmpDTO } from './dto/search-emp.dto';
import { SignInDTO } from './dto/signIn-employee.dto';
import { UpdateEmployeeDTO } from './dto/update-employee.dto';
import { Employee } from './emloyee.entity';
import { EmployeeService } from './employee.service';
import { JobType } from './enum/job-type.enum';
import { JobService } from './queue/add-crud-notice.queue';

@Controller('employee')
@UseInterceptors(ClassSerializerInterceptor)
export class EmployeeController {
  constructor(
    private employeeService: EmployeeService,
    private jobService: JobService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Get()
  @UseGuards(AuthGuard())
  getEmployees(
    @Query() searchDto: SearchEmpDTO,
    @getEmployee() admin: Employee,
  ) {
    return this.employeeService.searchEmployees(searchDto, admin);
  }

  @Get('/:id')
  getEmpById(@Param('id', ParseIntPipe) id: number) {
    return this.employeeService.getFullnageById(id);
  }

  @Post()
  signUp(
    @Body(ValidationPipe) dto: EmployeeDTO,
    @Body(ValidationPipe) dtoSer: NoticeMailDTO,
  ) {
    const emp = this.employeeService.signUp(dto);

    this.jobService.addJob(JobType.CREATE, dtoSer);

    // Logger.verbose(emp);
  }

  @Post('/signIn')
  signIn(
    @Body(ValidationPipe) dto: SignInDTO,
  ): Promise<{ accessToken: string }> {
    this.eventEmitter.emit('create.event', dto);
    return this.employeeService.signIn(dto);
  }

  @Patch()
  @UseGuards(AuthGuard())
  updateEmployee(
    @Body(ValidationPipe) updateDto: UpdateEmployeeDTO,
    @getEmployee() user: Employee,
  ) {
    this.employeeService.updateOwnInfo(updateDto, user);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard())
  deleteEmployee(
    @Param('id', ParseIntPipe) id: number,
    @getEmployee() admin: Employee,
  ) {
    //
    return this.employeeService.deleteEmployee(id, admin);
  }
}
