import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLastActivityDto } from './dto/create-last-activity.dto';

@Injectable()
export class LastActivityService {
  constructor(private prisma: PrismaService) {}

  // Student activity create / update
  async upsert(userId: number, dto: CreateLastActivityDto) {
    // check if activity exists
    const existing = await this.prisma.lastActivity.findUnique({
      where: { userId },
    });

    if (existing) {
      // update existing record
      return this.prisma.lastActivity.update({
        where: { userId },
        data: {
          url: dto.url ?? existing.url,
          courseId: dto.courseId ?? existing.courseId,
          groupId: dto.groupId ?? existing.groupId,
          lessonId: dto.lessonId ?? existing.lessonId,
          updatedAt: new Date(),
        },
      });
    }

    // create new record if not exists
    return this.prisma.lastActivity.create({
      data: {
        userId,
        url: dto.url,
        courseId: dto.courseId,
        groupId: dto.groupId,
        lessonId: dto.lessonId,
      },
    });
  }

  // Admin / Mentor / User uchun oxirgi activity ko‘rish
  async findByUser(userId: number) {
    const activity = await this.prisma.lastActivity.findUnique({
      where: { userId },
      include: {
        course: true,
        group: true,
        lesson: true,
      },
    });

    if (!activity) throw new NotFoundException('Activity not found');

    return activity;
  }

  // barcha activitylarni ko‘rish (admin / mentor)
  async findAll() {
    return this.prisma.lastActivity.findMany({
      include: { user: true, course: true, group: true, lesson: true },
      orderBy: { updatedAt: 'desc' },
    });
  }
}
