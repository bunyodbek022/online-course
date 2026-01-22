import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';
import { ResetPasswordDto } from '../users/dto/reset-password.dto';
import * as bcrypt from 'bcrypt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { SmsService } from 'src/services/sms.service';
import { ResetPhoneNumber } from './dto/reset-my-phone-number.dto';
@Injectable()
export class MyProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly smsService: SmsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async myProfile(id: number) {
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
      throw new NotFoundException('Bunday user topilmadi');
    }
    return {
      success: true,
      data: user,
    };
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

  async update(
    id: number,
    payload: UpdateMyProfileDto,
    file?: Express.Multer.File,
  ) {
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

  async resetPassword(id: number, payload: ResetPasswordDto) {
    console.log("salom")
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(payload.oldPassword, user.password);

    if (!isMatch) {
      throw new ForbiddenException('Old password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(payload.newPassword, 10);

    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return {
      success: true,
      message: 'password updated successfully',
    };
  }

  async resetPhoneNumber(newNumber: ResetPhoneNumber, id: number) {
  const cleanPhone = newNumber.phone.replace(/\D/g, '');

  const formattedPhone = cleanPhone.startsWith('998')
    ? `+${cleanPhone}`
    : `+998${cleanPhone}`;

  const isThrottled = await this.cacheManager.get(`limit_${formattedPhone}`);
  if (isThrottled) {
    throw new BadRequestException('1 daqiqa kuting');
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const cacheKey = `otp_${formattedPhone}`;


    try {
    await this.cacheManager.set(cacheKey, otpCode, 120000);
    await this.cacheManager.set(`limit_${formattedPhone}`, true, 60000);

    const savedCode = await this.cacheManager.get<string>(cacheKey);
    console.log('HOZIRGINA SAQLANDI:', savedCode);

    await this.smsService.resetPhoneNumber(formattedPhone, otpCode);

    return {
      success: true,
      message: 'Tasdiqlash kodi telefoningizga yuborildi.',
      expiresIn: '2 minutes',
    };
  } catch (error: any) {
    console.error('RESET PHONE ERROR:', error);
    throw new InternalServerErrorException('OTP yuborishda xatolik');
  }
}

  async verifyPhoneChangeOtp(phone: string, userCode: string, userId: number) {
  const cleanPhone = phone.replace(/\D/g, '');
  const formattedPhone = cleanPhone.startsWith('998')
    ? `+${cleanPhone}`
    : `+998${cleanPhone}`;

  const cacheKey = `otp_${formattedPhone}`;
  const cachedCode = await this.cacheManager.get(cacheKey);

  if (!cachedCode) {
    throw new BadRequestException("Tasdiqlash kodi topilmadi yoki muddati o'tgan");
  }

  if (String(cachedCode) !== String(userCode)) {
    throw new BadRequestException("Tasdiqlash kodi noto'g'ri");
  }

  const existingUser = await this.prisma.user.findFirst({
    where: {
      phone: formattedPhone,
      NOT: { id: userId },
    },
  });

  if (existingUser) {
    throw new BadRequestException('Bu telefon raqami allaqachon band');
  }

  await this.prisma.user.update({
    where: { id: userId },
    data: {
      phone: formattedPhone,
      isActive: true,
    },
  });

  await this.cacheManager.del(cacheKey);
  await this.cacheManager.del(`limit_${formattedPhone}`);

  return {
    success: true,
    message: 'Telefon raqami muvaffaqiyatli yangilandi',
  };
}

}
