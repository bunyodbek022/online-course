import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { MentorProfileModule } from './modules/mentor-profile/mentor-profile.module';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';
import { CategoryModule } from './modules/category/category.module';
import { CourseModule } from './modules/course/course.module';
import { MyProfileModule } from './modules/my-profile/my-profile.module';
import { CourseRatingModule } from './modules/course-rating/course-rating.module';
import { LessonGroupModule } from './modules/lesson-group/lesson-group.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { LessonFileModule } from './modules/lesson-file/lesson-file.module';
import { HomeworkModule } from './modules/homework/homework.module';
import { HomeworkSubmissionModule } from './modules/homework-submission/homework-submission.module';
import { ExamModule } from './modules/exam/exam.module';
import { ExamResultModule } from './modules/exam-result/exam-result.module';
import { QuessionModule } from './modules/quession/quession.module';
import { QuessionAnswerModule } from './modules/quession-answer/quession-answer.module';
import { PurchaseCourseModule } from './modules/purchase-course/purchase-course.module';
import { LastActivityModule } from './modules/last-activity/last-activity.module';
import { LessonViewModule } from './modules/lesson-view/lesson-view.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule], 
      useFactory: async (configService: ConfigService) : Promise<JwtModuleOptions> => ({
        secret: configService.get<string>('JWT_SECRET') as string, 
        signOptions: { 
          expiresIn:  configService.get('JWT_EXPIRATION_TIME', '1h') ,
        },
      }),
      inject: [ConfigService], 
    }),
    CacheModule.register({
      isGlobal: true, 
      store: 'redis', 
    }),
    MentorProfileModule,
    CategoryModule,
    CourseModule,
    MyProfileModule,
    CourseRatingModule,
    LessonGroupModule,
    LessonsModule,
    LessonFileModule,
    HomeworkModule,
    HomeworkSubmissionModule,
    ExamModule,
    ExamResultModule,
    QuessionModule,
    QuessionAnswerModule,
    PurchaseCourseModule,
    LastActivityModule,
    LessonViewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
