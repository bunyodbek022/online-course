// exam-result.service.ts
import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubmitExamDto } from './dto/create-exam-result.dto';
import { ExamAnswer } from '@prisma/client';

@Injectable()
export class ExamResultService {
  constructor(private prisma: PrismaService) {}

  // STUDENT exam topshiradi
  async submit(dto: SubmitExamDto, userId: number) {
    const exams = await this.prisma.exam.findMany({
      where: { lessonGroupId: dto.lessonGroupId },
    });

    if (!exams.length) {
      throw new BadRequestException('No exams found');
    }

    let corrects = 0;
    let wrongs = 0;

    for (const exam of exams) {
      const userAnswer = dto.answers.find(
        (a) => a.examId === exam.id,
      );

      if (!userAnswer) {
        wrongs++;
        continue;
      }

      if (
        userAnswer.answer === exam.answer
      ) {
        corrects++;
      } else {
        wrongs++;
      }
    }

    const passed =
      corrects >= Math.ceil(exams.length * 0.6);

    return this.prisma.examResult.create({
      data: {
        lessonGroupId: dto.lessonGroupId,
        userId,
        corrects,
        wrongs,
        passed,
      },
    });
  }

  // STUDENT o‘z natijalari
  async myResults(userId: number) {
    return this.prisma.examResult.findMany({
      where: { userId },
      include: {
        lessonGroup: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ADMIN / MENTOR lessonGroup bo‘yicha
  async resultsByLessonGroup(
    lessonGroupId: number,
  ) {
    return this.prisma.examResult.findMany({
      where: { lessonGroupId },
      include: {
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
