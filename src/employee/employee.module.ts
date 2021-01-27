import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeController } from './employee.controller';
import { EmployeeRepository } from './employee.repository';
import { EmployeeService } from './employee.service';
//JWT Config
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt.strategy';
import { JobService } from './queue/add-crud-notice.queue';
import { JobConsumer } from './queue/handle-crud-notice.queue';
import { BullModule } from '@nestjs/bull';
import { JobType } from './enum/job-type.enum';
import { ScheduleModule } from '@nestjs/schedule';
import { EmployeeCRUDEventHandler } from './event/event-handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmployeeRepository]),
    JwtModule.register({
      secret: 'topSecret51',
      signOptions: {
        expiresIn: 3600,
      },
    }),
    PassportModule.register({
      defaultStrategy: 'jwt', //JWT Token
    }),
    BullModule.registerQueue({
      name: 'jobQueues',
      // redis: {
      //   port: 6380,
      // },
    }),
  ],
  controllers: [EmployeeController],
  providers: [
    EmployeeService,
    JwtStrategy,
    JobService,
    BullModule,
    JobConsumer,
    EmployeeCRUDEventHandler,
  ],
  exports: [JwtStrategy, PassportModule],
})
export class EmployeeModule {}
