import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyPhoneChangeDto {
  @ApiProperty({
    example: '+998939349340',
    description: 'Yangi telefon raqami',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: '123456',
    description: 'SMS orqali kelgan tasdiqlash kodi',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}
