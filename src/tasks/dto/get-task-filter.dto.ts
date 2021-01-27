import { IsIn, isIn, IsOptional } from 'class-validator';
import { TaskStatus } from '../task.task-status.enum';

export class GetTaskFilterDTO {
  @IsIn([TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.OPEN])
  @IsOptional()
  status: TaskStatus;

  @IsOptional()
  search: string;
}
