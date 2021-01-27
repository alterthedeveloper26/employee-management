import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { JobType } from '../enum/job-type.enum';
import { NoticeMailDTO } from '../dto/notice-mail.dto';

@Injectable()
export class JobService {
  constructor(@InjectQueue('jobQueues') private jobQueue: Queue) {}

  async addJob(type: JobType, noticeMailDTO: NoticeMailDTO) {
    Logger.debug('Added to queue', JobService.name);

    const job = await this.jobQueue
      .add(type, noticeMailDTO)
      .catch((error) => Logger.error(error, 'JobProducer'));
  }
}
