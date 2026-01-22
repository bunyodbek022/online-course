// exam-result.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ExamResultService } from './exam-result.service';
import { SubmitExamDto } from './dto/create-exam-result.dto';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';

@ApiTags('Exam Results')
@ApiCookieAuth('access_token')
@Controller('exam-results')
export class ExamResultController {
  constructor(
    private readonly service: ExamResultService,
  ) {}

  // STUDENT exam topshiradi
  @Post('submit')
  @Roles(UserRole.STUDENT)
  @UseGuards(AuthGuard, RolesGuard)
  submit(
    @Body() dto: SubmitExamDto,
    @Req() req,
  ) {
    return this.service.submit(
      dto,
      req.user.id,
    );
  }

  // STUDENT o‘z natijalari
  @Get('my')
  @Roles(UserRole.STUDENT)
  @UseGuards(AuthGuard, RolesGuard)
  myResults(@Req() req) {
    return this.service.myResults(req.user.id);
  }

  // ADMIN / MENTOR lessonGroup bo‘yicha
  @Get('lesson-group/:lessonGroupId')
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @UseGuards(AuthGuard, RolesGuard)
  resultsByLessonGroup(
    @Param('lessonGroupId', ParseIntPipe)
    lessonGroupId: number,
  ) {
    return this.service.resultsByLessonGroup(
      lessonGroupId,
    );
  }
}
