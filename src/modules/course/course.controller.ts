import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Query,
  Req,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/multer/multer.options';
import { CourseQueryDto } from './dto/find-all.dto';

@ApiTags('Course')
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post('create')
  @ApiCookieAuth('access_token')
  @Roles(UserRole.ADMIN, UserRole.ASSISTANT, UserRole.MENTOR)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateCourseDto })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'banner', maxCount: 1 },
        { name: 'introVideo', maxCount: 1 },
      ],
      multerOptions,
    ),
  )
  create(
    @Body() payload: CreateCourseDto,
    @UploadedFiles()
    files: {
      banner: Express.Multer.File[];
      introVideo: Express.Multer.File[];
    },
  ) {
    if (!files?.banner?.[0] || !files?.introVideo?.[0]) {
      throw new BadRequestException('Banner and intro video are required');
    }

    return this.courseService.create(payload, files);
  }

  @Get('all')
  @ApiOperation({ summary: 'Barcha kurslarni filtrlar bilan olish' })
  findAll(@Query() query: CourseQueryDto) {
    return this.courseService.findAll(query);
  }

  @Get('my')
  @ApiCookieAuth('access_token')
  @Roles(UserRole.MENTOR, UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Mentorning oziga tegishli kurslarni olish' })
  findAllMyCourses(@Query() query: CourseQueryDto, @Req() req: any) {
    const mentorId = req.user.id
    return this.courseService.findAll(query, mentorId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Res() res) {
    const user = res.user;
    return this.courseService.findOne(+id, user);
  }

  @Patch('update/:id')
  @ApiCookieAuth('access_token')
  @Roles(UserRole.ADMIN, UserRole.ASSISTANT, UserRole.MENTOR)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateCourseDto })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'banner', maxCount: 1 },
        { name: 'introVideo', maxCount: 1 },
      ],
      multerOptions,
    ),
  )
  update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @UploadedFiles()
    files: {
      banner?: Express.Multer.File[];
      introVideo?: Express.Multer.File[];
    },
  ) {
    return this.courseService.update(+id, updateCourseDto, files);
  }

  @Delete('delete/:id')
  @ApiCookieAuth('access_token')
  @Roles(UserRole.ADMIN, UserRole.ASSISTANT, UserRole.MENTOR)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.courseService.remove(+id);
  }
}
