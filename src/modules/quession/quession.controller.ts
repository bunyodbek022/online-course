// question.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { QuestionService } from './quession.service';
import { CreateQuestionDto } from './dto/create-quession.dto';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';

@ApiTags('Questions')
@ApiCookieAuth('access_token')
@Controller('questions')
export class QuestionController {
  constructor(private readonly service: QuestionService) {}

  // STUDENT savol beradi
  @Post()
  @Roles(UserRole.STUDENT)
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() dto: CreateQuestionDto, @Req() req) {
    return this.service.create(dto, req.user.id);
  }

  // STUDENT o‘z savollari
  @Get('my')
  @Roles(UserRole.STUDENT)
  @UseGuards(AuthGuard, RolesGuard)
  myQuestions(@Req() req) {
    return this.service.myQuestions(req.user.id);
  }

  // ADMIN / MENTOR course bo‘yicha
  @Get('course/:courseId')
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @UseGuards(AuthGuard, RolesGuard)
  byCourse(
    @Param('courseId', ParseIntPipe)
    courseId: number,
  ) {
    return this.service.byCourse(courseId);
  }

  // STUDENT read=true
  @Patch(':id/read')
  @Roles(UserRole.STUDENT)
  @UseGuards(AuthGuard, RolesGuard)
  markAsRead(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ) {
    return this.service.markAsRead(id, req.user.id);
  }
}
