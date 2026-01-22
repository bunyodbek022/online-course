import { 
  ConflictException, 
  Injectable, 
  NotFoundException, 
  ForbiddenException 
} from '@nestjs/common';
import { CreateRatingDto } from './dto/create-course-rating.dto';
import { UpdateCourseRatingDto } from './dto/update-course-rating.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CourseRatingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: CreateRatingDto, userId: number) {
    const existingRating = await this.prisma.rating.findFirst({
      where: { userId, courseId: payload.courseId },
    });

    if (existingRating) {
      throw new ConflictException("Siz ushbu kursga allaqachon baho bergansiz");
    }

    const newRating = await this.prisma.rating.create({
      data: { ...payload, userId },
    });

    return {
      success: true,
      message: "Reyting muvaffaqiyatli qo'shildi",
      data: newRating,
    };
  }

  async findAllByCourse(courseId: number) {
    const ratings = await this.prisma.rating.findMany({
      where: { courseId },
      include: {
        user: { select: { id: true, fullName: true, image: true } }, 
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: ratings };
  }

  async findOne(id: number) {
    const rating = await this.prisma.rating.findUnique({
      where: { id },
      include: { user: true, course: true },
    });

    if (!rating) throw new NotFoundException('Reyting topilmadi');

    return { success: true, data: rating };
  }

  async update(id: number, userId: number, payload: UpdateCourseRatingDto) {
    const rating = await this.prisma.rating.findUnique({ where: { id } });

    if (!rating) throw new NotFoundException('Reyting topilmadi');
    if (rating.userId !== userId) {
      throw new ForbiddenException("Boshqa foydalanuvchining reytingini o'zgartira olmaysiz");
    }

    const updatedRating = await this.prisma.rating.update({
      where: { id },
      data: payload,
    });

    return {
      success: true,
      message: "Reyting yangilandi",
      data: updatedRating,
    };
  }

  async remove(id: number, userId: number) {
    const rating = await this.prisma.rating.findUnique({ where: { id } });

    if (!rating) throw new NotFoundException('Reyting topilmadi');
    
    if (rating.userId !== userId) {
      throw new ForbiddenException("Sizda ushbu reytingni o'chirish huquqi yo'q");
    }

    await this.prisma.rating.delete({ where: { id } });

    return {
      success: true,
      message: "Reyting o'chirib tashlandi",
    };
  }
}