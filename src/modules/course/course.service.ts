import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole } from '@prisma/client';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CourseQueryDto } from './dto/find-all.dto';

@Injectable()
export class CourseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  async create(
  payload: CreateCourseDto,
  files: { banner: Express.Multer.File[]; introVideo: Express.Multer.File[] },
) {
  let bannerUrl: string;
  let videoUrl: string;

  try {
    const [bannerRes, videoRes] = await Promise.all([
      this.cloudinaryService.uploadImage(files.banner[0], 'courses'),
      this.cloudinaryService.uploadVideo(files.introVideo[0], 'courses'),
    ]);
    
    bannerUrl = bannerRes;
    videoUrl = videoRes;

    const course = await this.prisma.course.create({
      data: {
        ...payload, 
        banner: bannerUrl,
        introVideo: videoUrl,
      },
    });

    return { success: true, course };
  } catch (error) {
    console.error('COURSE_CREATE_ERROR:', error);
    throw new InternalServerErrorException('Kursni saqlashda xatolik yuz berdi');
  }
}

  async findAll(query: CourseQueryDto, forceMentorId?: number) {
  const { 
    offset, limit, search, level, 
    category_id, mentor_id, price_min, price_max, published 
  } = query;

  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { about: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Kategoriyalar va Mentorlar
  if (level) where.level = level;
  if (category_id) where.categoryId = category_id;
    if (published !== undefined) where.published = published;
    if (forceMentorId) {
    where.mentorId = forceMentorId;
  } else if (mentor_id) {
    where.mentorId = mentor_id;
  }

  // Narxlar oralig'i
  if (price_min !== undefined || price_max !== undefined) {
    where.price = {
      ...(price_min !== undefined && { gte: price_min }),
      ...(price_max !== undefined && { lte: price_max }),
    };
  }

  const [courses, total] = await Promise.all([
    this.prisma.course.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' }, 
      include: { category: true } 
    }),
    this.prisma.course.count({ where })
  ]);

  return {
    success: true,
    data: courses,
    meta: {
      total,
      offset,
      limit
    }
  };
}

  async findOne(id: number, user) {
    const hasAccess =
      user.role === UserRole.ADMIN || user.role === UserRole.MENTOR;
    let course;
    if (hasAccess) {
      course = await this.prisma.course.findUnique({
        where: {
          id: id,
        },
      });
    } else {
      course = await this.prisma.course.findUnique({
        where: {
          id: id,
          published: true,
        },
      });
    }
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return {
      success: true,
      data: course,
    };
  }

  async update(
  id: number,
  payload: UpdateCourseDto,
  files?: { banner?: Express.Multer.File[]; introVideo?: Express.Multer.File[] },
) {
  const course = await this.prisma.course.findUnique({ where: { id } });
  if (!course) {
    throw new NotFoundException(`ID: ${id} bo'lgan kurs topilmadi`);
  }

  const updateData: any = { ...payload };
  const uploadPromises: Promise<void>[] = [];

  try {
    if (files?.banner?.[0]) {
      const bannerPromise = this.cloudinaryService
        .uploadImage(files.banner[0], 'courses')
        .then(async (url) => {
          updateData.banner = url;
          if (course.banner) {
            await this.cloudinaryService.deleteFile(course.banner).catch(err => 
              console.error('Old banner delete error:', err)
            );
          }
        });
      uploadPromises.push(bannerPromise);
    }
    if (files?.introVideo?.[0]) {
      const videoPromise = this.cloudinaryService
        .uploadVideo(files.introVideo[0], 'courses')
        .then(async (url) => {
          updateData.introVideo = url;

          if (course.introVideo) {
            await this.cloudinaryService.deleteFile(course.introVideo).catch(err => 
              console.error('Old video delete error:', err)
            );
          }
        });
      uploadPromises.push(videoPromise);
    }
    if (uploadPromises.length > 0) {
      await Promise.all(uploadPromises);
    }

    const updatedCourse = await this.prisma.course.update({
      where: { id },
      data: updateData,
    });

    return {
      success: true,
      message: 'Kurs muvaffaqiyatli yangilandi',
      course: updatedCourse,
    };

  } catch (error) {
    console.error('COURSE_UPDATE_ERROR:', error);
    
    throw new InternalServerErrorException(
      error.message || 'Kursni yangilashda kutilmagan xatolik yuz berdi'
    );
  }
}

  async remove(id: number) {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });
    if (!course) {
      throw new NotFoundException('Course is not found');
    }
    await this.prisma.course.delete({ where: { id } });
    return {
      success: true,
      message: 'Course deleted successfully',
    };
  }
}
