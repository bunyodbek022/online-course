// lesson-file.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLessonFileDto } from './dto/create-lesson-file.dto';
import { UpdateLessonFileDto } from './dto/update-lesson-file.dto';

@Injectable()
export class LessonFileService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLessonFileDto) {
    return this.prisma.lessonFile.create({
      data: dto,
    });
  }

  async findByLessonId(lessonId: string) {
    const files = await this.prisma.lessonFile.findMany({
      where: { lessonId },
      orderBy: { createdAt: 'asc' },
    });

    if (!files.length) {
      throw new NotFoundException('Lesson files not found');
    }

    return files;
  }

  async update(id: number, dto: UpdateLessonFileDto) {
    const file = await this.prisma.lessonFile.findUnique({
      where: { id },
    });

    if (!file) {
      throw new NotFoundException('Lesson file not found');
    }

    return this.prisma.lessonFile.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    const file = await this.prisma.lessonFile.findUnique({
      where: { id },
    });

    if (!file) {
      throw new NotFoundException('Lesson file not found');
    }

    return this.prisma.lessonFile.delete({
      where: { id },
    });
  }
}
