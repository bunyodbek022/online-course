import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports : [CloudinaryModule],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
