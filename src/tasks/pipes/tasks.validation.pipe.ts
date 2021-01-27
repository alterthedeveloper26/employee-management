import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { TaskStatus } from '../task.task-status.enum';

// import { PipeTransform } from '@nestjs/common';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatus = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];

  transform(value: any) {
    console.log('value', value);

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} is not a valid status!`);
    }

    return value;
  }

  isStatusValid = (status: any) => {
    status = status.toUpperCase();

    const idx: number = this.allowedStatus.indexOf(status);

    return idx !== -1;
  };
}
