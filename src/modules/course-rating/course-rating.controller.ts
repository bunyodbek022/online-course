import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { CourseRatingService } from './course-rating.service';
import { CreateRatingDto } from './dto/create-course-rating.dto';
import { UpdateCourseRatingDto } from './dto/update-course-rating.dto';
import { ApiCookieAuth, ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';

@Controller('course-rating')
export class CourseRatingController {
  constructor(private readonly courseRatingService: CourseRatingService) {}

  @Post()
  @ApiCookieAuth('access_token')
  @Roles(UserRole.STUDENT)
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() payload: CreateRatingDto, @Req() req) {
    const userId = req.user.id;
    return this.courseRatingService.create(payload, userId);
  }

  @Get('list/:courseId')
  @ApiOperation({
    summary: "Bitta kursga tegishli barcha reytinglarni ko'rish",
  })
  findAllByCourse(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.courseRatingService.findAllByCourse(courseId);
  }

  @Get(':id')
  @ApiOperation({ summary: "Reytingni ID bo'yicha ko'rish" })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.courseRatingService.findOne(id);
  }

  @Patch(':id')
  @ApiCookieAuth('access_token')
  @Roles(UserRole.STUDENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: "O'z reytingini tahrirlash" })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCourseRatingDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return this.courseRatingService.update(id, userId, updateDto);
  }

  @Delete(':id')
  @ApiCookieAuth('access_token')
  @Roles(UserRole.STUDENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: "O'z reytingini o'chirib tashlash" })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const userId = req.user.id;
    return this.courseRatingService.remove(id, userId);
  }
}
