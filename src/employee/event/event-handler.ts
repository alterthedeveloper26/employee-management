import { Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SignInDTO } from '../dto/signIn-employee.dto';

export class EmployeeCRUDEventHandler {
  logger = new Logger('EmployeeCRUDEventHandler');
  @OnEvent('*.event')
  handleOrderCreatedEvent(payload: SignInDTO) {
    // handle and process "OrderCreatedEvent" event
    const today = new Date();
    this.logger.verbose(
      `User ${payload.username} has login into account (${today})`,
    );
  }
}
