import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMentorProfileDto } from './dto/create-mentor-profile.dto';
import { UpdateMentorProfileDto } from './dto/update-mentor-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole } from '@prisma/client';

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
      return `This action returns all mentorProfile`;
  }

  async findOne(id: number) {
      return `This action returns a #${id} mentorProfile`;
  }

  async update(id: number, payload: UpdateMentorProfileDto) {
      return `This action updates a #${id} mentorProfile`;
  }

  async remove(id: number) {
      return `This action removes a #${id} mentorProfile`;
  }
}
