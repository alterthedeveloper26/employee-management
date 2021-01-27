import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Employee } from '../emloyee.entity';

export const getEmployee = createParamDecorator(
  (_: any, ctx: ExecutionContext): Employee => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
