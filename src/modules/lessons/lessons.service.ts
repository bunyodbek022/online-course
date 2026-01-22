// lesson.service.ts
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class LessonService {
  constructor(
    private prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(dto: CreateLessonDto, videos: Express.Multer.File[]) {
  const videoFile = videos[0];
  const videoUrl = await this.cloudinaryService.uploadVideo(videoFile, 'courses');

  return this.prisma.lesson.create({
    data: {
      name: dto.name,
      about: dto.about,
      groupId: dto.groupId,
      video: videoUrl,
    },
  });
}


  async getDetail(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        files: true,
        homework: true,
        views: true,
        lastActivities: true,
        group: true,
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson;
  }

  async getSingle(lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        name: true,
        about: true,
        video: true,
        files: true,
        createdAt: true,
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson;
  }

  async update(id: string, dto: UpdateLessonDto) {
    await this.getDetail(id);

    return this.prisma.lesson.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.getDetail(id);

    return this.prisma.lesson.delete({
      where: { id },
    });
  }
}
