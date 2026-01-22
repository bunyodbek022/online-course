import { Module } from '@nestjs/common';
import { QuestionService } from './quession.service';
import { QuestionController } from './quession.controller';

@Module({
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuessionModule {}
