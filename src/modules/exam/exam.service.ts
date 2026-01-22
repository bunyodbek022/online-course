// exam.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';

@Injectable()
export class ExamService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateExamDto) {
    return this.prisma.exam.create({
      data: dto,
    });
  }

  // ADMIN / MENTOR – to‘liq ko‘radi
  async findByLessonGroupForAdmin(lessonGroupId: number) {
    return this.prisma.exam.findMany({
      where: { lessonGroupId },
      orderBy: { createdAt: 'asc' },
    });
  }

  // STUDENT – answer chiqmaydi
  async findByLessonGroupForStudent(lessonGroupId: number) {
    return this.prisma.exam.findMany({
      where: { lessonGroupId },
      select: {
        id: true,
        question: true,
        variantA: true,
        variantB: true,
        variantC: true,
        variantD: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async update(id: number, dto: UpdateExamDto) {
    const exam = await this.prisma.exam.findUnique({
      where: { id },
    });

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    return this.prisma.exam.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    const exam = await this.prisma.exam.findUnique({
      where: { id },
    });

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    return this.prisma.exam.delete({
      where: { id },
    });
  }
}
