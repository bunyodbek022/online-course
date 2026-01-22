import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuestionAnswerDto } from './dto/create-quession-answer.dto';
import { UpdateQuessionAnswerDto } from './dto/update-quession-answer.dto';

@Injectable()
export class QuestionAnswerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateQuestionAnswerDto) {
    const question = await this.prisma.question.findUnique({
      where: { id: dto.questionId },
      include: { answer: true },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    if (question.answer) {
      throw new BadRequestException('This question already has an answer');
    }

    return this.prisma.questionAnswer.create({
      data: {
        text: dto.text,
        file: dto.file,
        questionId: dto.questionId,
        userId,
      },
    });
  }

  async findByQuestionId(questionId: number) {
    const answer = await this.prisma.questionAnswer.findUnique({
      where: { questionId },
      include: {
        user: {
          select: { id: true, fullName: true },
        },
      },
    });

    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    return answer;
  }

  async update(id: number, dto: UpdateQuessionAnswerDto) {
    const answer = await this.prisma.questionAnswer.findUnique({
      where: { id },
    });

    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    return this.prisma.questionAnswer.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    const answer = await this.prisma.questionAnswer.findUnique({
      where: { id },
    });

    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    return this.prisma.questionAnswer.delete({
      where: { id },
    });
  }
}
