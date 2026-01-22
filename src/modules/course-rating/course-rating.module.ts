import { Module } from '@nestjs/common';
import { CourseRatingService } from './course-rating.service';
import { CourseRatingController } from './course-rating.controller';

@Module({
  controllers: [CourseRatingController],
  providers: [CourseRatingService],
})
export class CourseRatingModule {}
