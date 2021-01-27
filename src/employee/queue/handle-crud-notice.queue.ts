import {
  Processor,
  Process,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
} from '@nestjs/bull';
import { Controller, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { Interval } from '@nestjs/schedule';
import { NoticeMailDTO } from '../dto/notice-mail.dto';
import { sendMail } from 'src/util/send-mail.nodemailer';

@Processor('jobQueues')
export class JobConsumer {
  logger = new Logger('JobConsumer');

  @Process('create')
  async transcode(job: Job<NoticeMailDTO>) {
    Logger.debug('Start processing queue');

    Logger.debug(job.data.email);

    await sendMail(job.data);

    return {};
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(
      `Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(
        job.data,
      )}`,
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job, result: any) {
    this.logger.verbose(
      `Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(
        result,
      )}`,
    );
  }

  @OnQueueFailed()
  onError(job: Job<any>, error: any) {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }
}
