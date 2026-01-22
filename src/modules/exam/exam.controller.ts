// exam.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';

@ApiTags('Exams')
@ApiCookieAuth('access_token')
@Controller('exams')
export class ExamController {
  constructor(private readonly service: ExamService) {}

  // ADMIN / MENTOR savol qo‘shadi
  @Post()
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() dto: CreateExamDto) {
    return this.service.create(dto);
  }

  // ADMIN / MENTOR – answer bilan
  @Get('admin/lesson-group/:lessonGroupId')
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @UseGuards(AuthGuard, RolesGuard)
  getForAdmin(
    @Param('lessonGroupId', ParseIntPipe) lessonGroupId: number,
  ) {
    return this.service.findByLessonGroupForAdmin(
      lessonGroupId,
    );
  }

  // STUDENT – answersiz
  @Get('student/lesson-group/:lessonGroupId')
  @Roles(UserRole.STUDENT)
  @UseGuards(AuthGuard, RolesGuard)
  getForStudent(
    @Param('lessonGroupId', ParseIntPipe) lessonGroupId: number,
  ) {
    return this.service.findByLessonGroupForStudent(
      lessonGroupId,
    );
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @UseGuards(AuthGuard, RolesGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateExamDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
