import { TaskStatus } from '../task.task-status.enum';
import { TasksService } from '../tasks.service';

export class UpdateTaskDTO {
  title: string;
  description: string;
  status: TaskStatus;
}
