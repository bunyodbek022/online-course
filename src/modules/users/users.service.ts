import {
  BadRequestException,
  HttpException,
  Inject,
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
import { SmsService } from 'src/services/sms.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly smsService: SmsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async register(payload: RegisterDto, file?: Express.Multer.File) {
    const cleanPhone = payload.phone.replace(/\D/g, '');
    const existingUser = await this.prisma.user.findUnique({
      where: {
        phone: `+${cleanPhone.startsWith('998') ? cleanPhone : '998' + cleanPhone}`,
      },
    });

    if (existingUser && existingUser.isActive) {
      return { success: false, message: 'User  already exists' };
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const user = {
      fullName: payload.fullName,
      phone: payload.phone,
      password: hashedPassword,
      ...(file && { image: `/uploads/${file.filename}` }),
    };

    await this.sendOtp(cleanPhone, user);
    return {
      success: true,
      message: 'Tasdiqlash kodi yuborildi',
    };
  }

  async login(payload: LoginUserDto, res: Response) {
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

    if (!user.isActive) {
      return {
        success: false,
        message:
          'User verificatsiya qilinmagan, qaytadan register qilib koring!',
      };
    }

    const token = this.jwtService.sign({
      id: user.id,
      role: user.role,
    });

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60,
    });

    const DATE_TIME_FORMAT = 'yyyy-MM-dd HH:mm';

    res.send({
      success: true,
      message: 'Muvaffaqqiyatli kirildi',
      data: {
        user_id: user.id,
        fullName: user.fullName,
        role: user.role,
        image: user.image,
        createAt: format(user.createdAt, DATE_TIME_FORMAT),
      },
    });
  }
  async findAll() {
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
  }

  async findOne(id: number) {
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
  }

  async update(id: number, payload: UpdateUserDto, file?: Express.Multer.File) {
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
  }

  async remove(id: number) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return {
        success: false,
        message: 'User topilmadi',
      };
    }
    return this.prisma.user.delete({ where: { id } });
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

  async sendOtp(phone: string, userData: any) {
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('998')
      ? `+${cleanPhone}`
      : `+998${cleanPhone}`;

    const isThrottled = await this.cacheManager.get(`limit_${formattedPhone}`);
    if (isThrottled) throw new BadRequestException('1 daqiqa kuting');

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const cacheKey = `otp_${formattedPhone}`;

    try {
      const cacheData = JSON.stringify({
        code: otpCode,
        userData: userData || null,
      });
      await this.cacheManager.set(cacheKey, cacheData, 120000);
      const testCheck = await this.cacheManager.get(cacheKey);
      console.log('HOZIRGINA SAQLANDI:', testCheck);
      await this.cacheManager.set(`limit_${formattedPhone}`, true, 60000);
      await this.smsService.sendOtp(formattedPhone, otpCode);

      return {
        success: true,
        message: 'Tasdiqlash kodi telefoningizga yuborildi.',
        expiresIn: '2 minutes',
      };
    } catch (error: any) {
      console.error(
        'OTP yuborishda xatolik:',
        error.response?.data || error.message,
      );
      throw new InternalServerErrorException(
        'SMS yuborish tizimida xatolik yuz berdi',
      );
    }
  }

  async verifyOtp(phone: string, userCode: string) {
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('998')
      ? `+${cleanPhone}`
      : `+998${cleanPhone}`;

    const cacheKey = `otp_${formattedPhone}`;

    const rawData = await this.cacheManager.get<string>(cacheKey);
    console.log('KESHDAN KELDI:', rawData);

    if (!rawData) {
      throw new BadRequestException("Kod topilmadi yoki muddati o'tgan");
    }

    let parsedData;
    try {
      parsedData = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
    } catch (e) {
      parsedData = rawData;
    }
    if (!parsedData) {
      throw new BadRequestException("Kod muddati o'tgan yoki xato raqam");
    }

    console.log(parsedData.code);
    if (parsedData.code !== userCode) {
      throw new BadRequestException('Tasdiqlash kodi xato');
    }

    let user = await this.prisma.user.findUnique({
      where: { phone: formattedPhone },
    });
    if (!user) {
      if (!parsedData.userData) {
        throw new BadRequestException(
          "Foydalanuvchi ma'lumotlari topilmadi, qaytadan ro'yxatdan o'ting",
        );
      }

      user = await this.prisma.user.create({
        data: {
          phone: formattedPhone,
          isActive: true,
          fullName: parsedData.userData.fullName,
          password: parsedData.userData.password,
        },
      });
    } else {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { isActive: true },
      });
    }

    await this.cacheManager.del(`otp_${formattedPhone}`);
    await this.cacheManager.del(`limit_${formattedPhone}`);

    return {
      success: true,
      message: 'Telefon raqamingiz muvaffaqiyatli tasdiqlandi',
    };
  }
}
