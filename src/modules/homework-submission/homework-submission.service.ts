// homework-submission.service.ts
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHomeworkSubmissionDto } from './dto/create-homework-submission.dto';
import { UpdateHomeworkSubmissionDto } from './dto/update-homework-submission.dto';
import { ReviewHomeworkSubmissionDto } from './dto/review-homework-submission.dto';
import { HomeworkSubStatus } from '@prisma/client';

@Injectable()
export class HomeworkSubmissionService {
  constructor(private prisma: PrismaService) {}

  // STUDENT submission yuboradi
  async create(dto: CreateHomeworkSubmissionDto, userId: number) {
    return this.prisma.homeworkSubmission.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  // STUDENT faqat o‘z submissionini ko‘radi
  async findMySubmissions(userId: number) {
    return this.prisma.homeworkSubmission.findMany({
      where: { userId },
      include: {
        homework: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByHomework(homeworkId: number) {
    return this.prisma.homeworkSubmission.findMany({
      where: { homeworkId },
      include: {
        user: true,
      },
    });
  }

  async update(
    id: number,
    dto: UpdateHomeworkSubmissionDto,
    userId: number,
  ) {
    const submission = await this.prisma.homeworkSubmission.findUnique({
      where: { id },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    if (submission.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (submission.status !== HomeworkSubStatus.PENDING) {
      throw new ForbiddenException(
        'Reviewed submission cannot be edited',
      );
    }

    return this.prisma.homeworkSubmission.update({
      where: { id },
      data: dto,
    });
  }

  // MENTOR / ADMIN tekshiradi
  async review(
    id: number,
    dto: ReviewHomeworkSubmissionDto,
  ) {
    const submission = await this.prisma.homeworkSubmission.findUnique({
      where: { id },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    return this.prisma.homeworkSubmission.update({
      where: { id },
      data: {
        status: dto.status,
        reason: dto.reason,
      },
    });
  }
}
