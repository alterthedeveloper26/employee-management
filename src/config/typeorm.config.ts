import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3305,
  username: 'root',
  password: '@Kid14422000',
  database: 'employeemanagement',
  entities: [__dirname + '../../**/*.entity.js'],
  synchronize: false,
};
