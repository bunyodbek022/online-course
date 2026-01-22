// lesson-group.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLessonGroupDto } from './dto/create-lesson-group.dto';
import { UpdateLessonGroupDto } from './dto/update-lesson-group.dto';

@Injectable()
export class LessonGroupService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLessonGroupDto) {
    return this.prisma.lessonGroup.create({
      data: dto,
    });
  }

  async findAll(limit = 10, offset = 0) {
    const [data, total] = await Promise.all([
      this.prisma.lessonGroup.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.lessonGroup.count(),
    ]);

    return {
      total,
      limit,
      offset,
      data,
    };
  }

  async findAllByCourseId(courseId: number, limit = 10, offset = 0) {
    const [data, total] = await Promise.all([
      this.prisma.lessonGroup.findMany({
        where: { courseId },
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.lessonGroup.count({
        where: { courseId },
      }),
    ]);

    return {
      total,
      limit,
      offset,
      data,
    };
  }

  async findOne(id: number) {
    const lessonGroup = await this.prisma.lessonGroup.findUnique({
      where: { id },
    });

    if (!lessonGroup) {
      throw new NotFoundException('LessonGroup not found');
    }

    return lessonGroup;
  }

  async update(id: number, dto: UpdateLessonGroupDto) {
    await this.findOne(id);
    return this.prisma.lessonGroup.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.lessonGroup.delete({
      where: { id },
    });
  }
}
