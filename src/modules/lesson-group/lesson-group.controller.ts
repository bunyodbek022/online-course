// lesson-group.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { LessonGroupService } from './lesson-group.service';
import { CreateLessonGroupDto } from './dto/create-lesson-group.dto';
import { UpdateLessonGroupDto } from './dto/update-lesson-group.dto';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';

@ApiTags('Lesson Groups')
@Controller('lesson-groups')
export class LessonGroupController {
  constructor(private readonly service: LessonGroupService) {}

  @ApiCookieAuth('access_token')
  @Roles(UserRole.ADMIN, UserRole.ASSISTANT, UserRole.MENTOR)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('create')
  create(@Body() dto: CreateLessonGroupDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'offset', required: false, example: 0 })
  findAll(@Query('limit') limit?: number, @Query('offset') offset?: number) {
    return this.service.findAll(Number(limit) || 10, Number(offset) || 0);
  }

  @Get('all/:courseId')
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'offset', required: false, example: 0 })
  findAllByCourse(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.service.findAllByCourseId(
      courseId,
      Number(limit) || 10,
      Number(offset) || 0,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @ApiCookieAuth('access_token')
  @Roles(UserRole.ADMIN, UserRole.ASSISTANT, UserRole.MENTOR)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLessonGroupDto,
  ) {
    return this.service.update(id, dto);
  }

  @ApiCookieAuth('access_token')
  @Roles(UserRole.ADMIN, UserRole.ASSISTANT, UserRole.MENTOR)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
