// homework.controller.ts
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
import { HomeworkService } from './homework.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';

@ApiTags('Homework')
@ApiCookieAuth('access_token')
@Controller('homeworks')
export class HomeworkController {
  constructor(private readonly service: HomeworkService) {}

  
  @Post()
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() dto: CreateHomeworkDto) {
    return this.service.create(dto);
  }

  // lessonId orqali olish
  @Get('lesson/:lessonId')
  @Roles(
    UserRole.ADMIN,
    UserRole.MENTOR,
    UserRole.STUDENT,
  )
  @UseGuards(AuthGuard, RolesGuard)
  findByLesson(
    @Param('lessonId') lessonId: string,
  ) {
    return this.service.findByLessonId(lessonId);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @UseGuards(AuthGuard, RolesGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHomeworkDto,
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
