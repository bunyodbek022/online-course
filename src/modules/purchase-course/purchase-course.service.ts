import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PurchaseCourseDto } from './dto/purchase-course.dto';

@Injectable()
export class PurchasedCourseService {
  constructor(private prisma: PrismaService) {}

  async purchase(userId: number, dto: PurchaseCourseDto) {
    const course = await this.prisma.course.findUnique({
      where: { id: dto.courseId },
    });
    if (!course) throw new NotFoundException('Course not found');

    const exists = await this.prisma.purchasedCourse.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: dto.courseId,
        },
      },
    });
    if (exists) return exists;

    if (dto?.amount !== Number(course.price)) {
      throw new BadRequestException(`Siz kurs uchun ${course.price} som to'lov qilishingiz kerak`)
    }
    const purchased = await this.prisma.purchasedCourse.create({
      data: {
        userId,
        courseId: dto.courseId,
        amount: dto.amount,
        paidVia: dto.paidVia,
      },
    });

    await this.prisma.assignedCourse.create({
      data: {
        userId,
        courseId: dto.courseId,
      },
    });

    return purchased;
  }

  async myPurchasedCourses(userId: number) {
    return this.prisma.purchasedCourse.findMany({
      where: { userId },
      include: { course: true },
      orderBy: { purchasedAt: 'desc' },
    });
  }
}
