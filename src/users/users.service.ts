import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';
import { format } from 'date-fns';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async register(payload: RegisterDto, file?: Express.Multer.File) {
    try {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          phone: payload.phone,
        },
      });

      if (existingUser) {
        return { success: false, message: 'User  already exists' };
      }

      const hashedPassword = await bcrypt.hash(payload.password, 10);
      const user = await this.prisma.user.create({
        data: {
          fullName: payload.fullName,
          phone: payload.phone,
          password: hashedPassword,
          role: payload.role,
          ...(file && { image: `/uploads/${file.filename}` }),
        },
      });
      const DATE_TIME_FORMAT = 'yyyy-MM-dd HH:mm';

      return {
        success: true,
        message: "Ro'yxatdan muvaffaqiyatli o'tdingiz",
        data: {
          fullName: user.fullName,
          role: user.role,
          image: user.image,
          createdAt: format(user.createdAt, DATE_TIME_FORMAT),
        },
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({
        message: 'User register qilishda xatolik yuz berdi ',
        error,
      });
    }
  }

  async login(payload: LoginUserDto, res: Response) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          phone: payload.phone,
        },
      });

      if (!user) {
        throw new NotFoundException('User topilmadi');
      }
      const isMatch = await bcrypt.compare(payload.password, user.password);

      if (!isMatch) {
        return {
          success: false,
          message: 'phone number yoki parolda xatolik',
        };
      }

      const token = this.jwtService.sign({
        id: user.id,
        role: user.role,
      });

      const isAdmin =
        user.role === UserRole.ADMIN || user.role === UserRole.ASSISTANT;
      const isProduction = process.env.NODE_ENV === 'production';

      res.cookie('accessToken', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
        maxAge: 1000 * 60 * 60,
      });

      res.send({
        success: true,
        message: 'Muvaffaqqiyatli kirildi',
        data: {
          user_id: user.id,
          fullName: user.fullName,
          role: user.role,
          image: user.image,
        },
      });
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException({
        message: 'User login qilishda xatolik yuz berdi ',
        error,
      });
    }
  }
  async findAll() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          fullName: true,
          phone: true,
          role: true,
          image: true,
          createdAt: true,
        },
      });
      return {
        success: true,
        message: "Hamma userlar ro'yxati",
        data: users,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({
        message: 'Userlar malumotlarni  olishda xatolik yuz berdi ',
        error,
      });
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          fullName: true,
          phone: true,
          role: true,
          image: true,
          createdAt: true,
        },
      });

      if (!user) {
        return {
          success: false,
          message: 'Bunday user topilmadi',
        };
      }
      return {
        success: true,
        data: user,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({
        message: 'User malumotlarni  olishda xatolik yuz berdi ',
        error,
      });
    }
  }

  async update(
  id: number,
  payload: UpdateUserDto,
  file?: Express.Multer.File,
) {
  try {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return {
        success: false,
        message: 'User topilmadi',
      };
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...payload,
        ...(file && { image: `/uploads/${file.filename}` }),
      },
    });

    return {
      success: true,
      message: 'User malumotlari yangilandi',
      data: {
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        phone: updatedUser.phone,
        role: updatedUser.role,
        image: updatedUser.image,
      },
    };
  } catch (error) {
    console.log(error);
    throw new InternalServerErrorException({
      message: 'User malumotlarini update qilishda xatolik yuz berdi',
      error,
    });
  }
}


  async remove(id: number) {
    try {
      return this.prisma.user.delete({ where: { id } });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({
        message: "Useni o'chirishda xatolik yuz berdi ",
        error,
      });
    }
  }

  async logout(res: Response) {
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
    });
    res.send({ succcess: true, message: 'Muvaffaqiyatli tizimdan chiqildi' });
  }
}
