import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateMentorProfileDto } from './dto/create-mentor-profile.dto';
import { UpdateMentorProfileDto } from './dto/update-mentor-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole } from '@prisma/client';
import { pid } from 'process';

@Injectable()
export class MentorProfileService {
  constructor(private readonly prisma: PrismaService) {}
  async create(payload: CreateMentorProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== UserRole.MENTOR) {
      throw new ForbiddenException('User is not a mentor');
    }

    const profile = await this.prisma.mentorProfile.create({
      data: payload,
    });

    return {
      success: true,
      message: 'Mentor profile created successfully',
      data: profile,
    };
  }

  async findAll() {
    const mentors = await this.prisma.user.findMany({
      where: {
        role: UserRole.MENTOR,
        isActive: true,
      },
      select: {
        mentorProfile: true,
      },
    });
    return {
      success: true,
      data: mentors,
    };
  }

  async findOne(id: number) {
    const mentor = await this.prisma.user.findUnique({
      where: {
        id,
      },

      select: {
        mentorProfile: true,
        role: true,
        isActive: true,
      },
    });
    if (!mentor || mentor.role !== UserRole.MENTOR) {
      throw new NotFoundException('Bunday iddagi mentor topilmadi');
    }

    if (!mentor.isActive) {
      throw new UnauthorizedException("Mentor verificatsiyadan o'tmagan");
    }
    return {
      success: true,
      data: mentor,
    };
  }

  async update(id: number, payload: UpdateMentorProfileDto) {
    await this.findOne(id);
    await this.prisma.user.update({
      where: { id },
      data: payload,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.user.delete({ where: { id } });
  }
}
