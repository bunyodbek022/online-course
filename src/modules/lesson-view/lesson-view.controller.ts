import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { LessonViewService } from './lesson-view.service';
import { CreateLessonViewDto } from './dto/create-lesson-view.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Lesson Views')
@ApiCookieAuth('access_token')
@Controller('lesson-view')
export class LessonViewController {
  constructor(private readonly service: LessonViewService) {}

  // Student lessonni ko‘rdi → view update / create
  @Patch()
  @Roles(UserRole.STUDENT)
  @UseGuards(AuthGuard, RolesGuard)
  upsert(@Body() dto: CreateLessonViewDto, @Req() req) {
    return this.service.upsert(req.user.id, dto);
  }

  // Student o‘z lesson viewlarini ko‘radi
  @Get('my')
  @Roles(UserRole.STUDENT)
  @UseGuards(AuthGuard, RolesGuard)
  myViews(@Req() req) {
    return this.service.findByUser(req.user.id);
  }

  // Admin / mentor barcha lesson viewlarini ko‘radi
  @Get()
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @UseGuards(AuthGuard, RolesGuard)
  allViews() {
    return this.service.findAll();
  }
}
