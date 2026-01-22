// homework.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';

@Injectable()
export class HomeworkService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateHomeworkDto) {
    const existing = await this.prisma.homework.findUnique({
      where: { lessonId: dto.lessonId },
    });

    if (existing) {
      throw new BadRequestException(
        'This lesson already has a homework',
      );
    }

    return this.prisma.homework.create({
      data: dto,
    });
  }

  async findByLessonId(lessonId: string) {
    const homework = await this.prisma.homework.findUnique({
      where: { lessonId },
      include: {
        submissions: true,
      },
    });

    if (!homework) {
      throw new NotFoundException('Homework not found');
    }

    return homework;
  }

  async update(id: number, dto: UpdateHomeworkDto) {
    const homework = await this.prisma.homework.findUnique({
      where: { id },
    });

    if (!homework) {
      throw new NotFoundException('Homework not found');
    }

    return this.prisma.homework.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    const homework = await this.prisma.homework.findUnique({
      where: { id },
    });

    if (!homework) {
      throw new NotFoundException('Homework not found');
    }

    return this.prisma.homework.delete({
      where: { id },
    });
  }
}
