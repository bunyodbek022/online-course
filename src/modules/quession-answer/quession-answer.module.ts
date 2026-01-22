import { Module } from '@nestjs/common';
import { QuestionAnswerService } from './quession-answer.service';
import { QuestionAnswerController } from './quession-answer.controller';

@Module({
  controllers: [QuestionAnswerController],
  providers: [QuestionAnswerService],
})
export class QuessionAnswerModule {}
