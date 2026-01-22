// lesson.controller.ts
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { LessonService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/multer/multer.options';

@ApiTags('Lessons')
@ApiCookieAuth('access_token')
@Controller('lessons')
export class LessonController {
  constructor(private readonly service: LessonService) {}

 @Post()
@Roles(UserRole.ADMIN, UserRole.MENTOR)
@UseGuards(AuthGuard, RolesGuard)
@ApiConsumes('multipart/form-data')
@ApiBody({ type: CreateLessonDto })
@UseInterceptors(
  FileFieldsInterceptor([{ name: 'video', maxCount: 1 }], multerOptions),
)
create(
  @Body() dto: CreateLessonDto,
  @UploadedFiles() files: { video?: Express.Multer.File[] },
) {
  if (!files?.video?.[0]) {
    throw new BadRequestException('Video file is required');
  }
  return this.service.create(dto, files.video);
}

  // ADMIN + MENTOR
  @Get('detail/:id')
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @UseGuards(AuthGuard, RolesGuard)
  getDetail(@Param('id') id: string) {
    return this.service.getDetail(id);
  }

  // STUDENT
  @Get('single/:lessonId')
  @Roles(UserRole.STUDENT)
  @UseGuards(AuthGuard, RolesGuard)
  getSingle(@Param('lessonId') lessonId: string) {
    return this.service.getSingle(lessonId);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @UseGuards(AuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() dto: UpdateLessonDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
