// homework-submission.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { HomeworkSubmissionService } from './homework-submission.service';
import { CreateHomeworkSubmissionDto } from './dto/create-homework-submission.dto';
import { UpdateHomeworkSubmissionDto } from './dto/update-homework-submission.dto';
import { ReviewHomeworkSubmissionDto } from './dto/review-homework-submission.dto';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';

@ApiTags('Homework Submissions')
@ApiCookieAuth('access_token')
@Controller('homework-submissions')
export class HomeworkSubmissionController {
  constructor(private readonly service: HomeworkSubmissionService) {}

  // STUDENT submission yuboradi
  @Post()
  @Roles(UserRole.STUDENT)
  @UseGuards(AuthGuard, RolesGuard)
  create(
    @Body() dto: CreateHomeworkSubmissionDto,
    @Req() req,
  ) {
    return this.service.create(dto, req.user.id);
  }

  // STUDENT o‘z submissionlari
  @Get('my')
  @Roles(UserRole.STUDENT)
  @UseGuards(AuthGuard, RolesGuard)
  mySubmissions(@Req() req) {
    return this.service.findMySubmissions(req.user.id);
  }

  // MENTOR / ADMIN homework bo‘yicha ko‘radi
  @Get('homework/:homeworkId')
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @UseGuards(AuthGuard, RolesGuard)
  findByHomework(
    @Param('homeworkId', ParseIntPipe) homeworkId: number,
  ) {
    return this.service.findByHomework(homeworkId);
  }

  // STUDENT submissionini tahrirlaydi
  @Patch(':id')
  @Roles(UserRole.STUDENT)
  @UseGuards(AuthGuard, RolesGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHomeworkSubmissionDto,
    @Req() req,
  ) {
    return this.service.update(id, dto, req.user.id);
  }

  // MENTOR / ADMIN review qiladi
  @Patch('review/:id')
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @UseGuards(AuthGuard, RolesGuard)
  review(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReviewHomeworkSubmissionDto,
  ) {
    return this.service.review(id, dto);
  }
}
