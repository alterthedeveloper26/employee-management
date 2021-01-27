import { BullModule } from '@nestjs/bull';

// import { BullModule } from '@mobizerg/nest-bull';
// import { QueueJobProcessor } from '../node_modules/';

import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { EmployeeModule } from './employee/employee.module';
import { RedisModule } from 'redis';
import { JobConsumer } from './employee/queue/handle-crud-notice.queue';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitter } from 'typeorm/platform/PlatformTools';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  //the list of imported modules that export the providers which are required in this module
  imports: [
    EmployeeModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot({ wildcard: true }),
  ],
  //the set of controllers defined in this module which have to be instantiated
  controllers: [],
  //the providers that will be instantiated by the Nest injector and that may be shared at least across this module
  providers: [BullModule],
})
export class AppModule {}
