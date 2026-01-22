import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLessonViewDto } from './dto/create-lesson-view.dto';

@Injectable()
export class LessonViewService {
  constructor(private prisma: PrismaService) {}

  // Student lessonni ko‘rdi → auto-upsert
  async upsert(userId: number, dto: CreateLessonViewDto) {
    const existing = await this.prisma.lessonView.findUnique({
      where: { lessonId_userId: { lessonId: dto.lessonId, userId } },
    });

    if (existing) {
      return this.prisma.lessonView.update({
        where: { lessonId_userId: { lessonId: dto.lessonId, userId } },
        data: { view: dto.view },
      });
    }

    return this.prisma.lessonView.create({
      data: {
        lessonId: dto.lessonId,
        userId,
        view: dto.view,
      },
    });
  }

  // Student o‘z lesson viewlarini ko‘radi
  async findByUser(userId: number) {
    return this.prisma.lessonView.findMany({
      where: { userId },
      include: { lesson: true },
      orderBy: { lesson: { createdAt: 'asc' } },
    });
  }

  // Admin / mentor barcha lesson viewlarini ko‘radi
  async findAll() {
    return this.prisma.lessonView.findMany({
      include: { user: true, lesson: true },
      orderBy: { lesson: { createdAt: 'asc' } },
    });
  }
}
