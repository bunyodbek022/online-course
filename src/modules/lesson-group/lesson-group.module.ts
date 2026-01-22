import { Module } from '@nestjs/common';
import { LessonGroupService } from './lesson-group.service';
import { LessonGroupController } from './lesson-group.controller';

@Module({
  controllers: [LessonGroupController],
  providers: [LessonGroupService],
})
export class LessonGroupModule {}
