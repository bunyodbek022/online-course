// question.service.ts
import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-quession.dto';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  // STUDENT savol beradi
  async create(dto: CreateQuestionDto, userId: number) {
    return this.prisma.question.create({
      data: {
        text: dto.text,
        file: dto.file,
        courseId: dto.courseId,
        userId,
      },
    });
  }

  // STUDENT o‘z savollari
  async myQuestions(userId: number) {
    return this.prisma.question.findMany({
      where: { userId },
      include: {
        answer: true,
        course: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ADMIN / MENTOR course bo‘yicha savollar
  async byCourse(courseId: number) {
    return this.prisma.question.findMany({
      where: { courseId },
      include: {
        user: true,
        answer: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // STUDENT savolni o‘qilgan deb belgilaydi
  async markAsRead(id: number, userId: number) {
    const question = await this.prisma.question.findUnique({
      where: { id },
    });

    if (!question || question.userId !== userId) {
      throw new ForbiddenException();
    }

    return this.prisma.question.update({
      where: { id },
      data: {
        read: true,
        readAt: new Date(),
      },
    });
  }
}
