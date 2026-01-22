import { Module } from '@nestjs/common';
import { PurchasedCourseService } from './purchase-course.service';
import { PurchasedCourseController } from './purchase-course.controller';

@Module({
  controllers: [PurchasedCourseController],
  providers: [PurchasedCourseService],
})
export class PurchaseCourseModule {}
