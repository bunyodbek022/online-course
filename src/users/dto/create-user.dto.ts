import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsPhoneNumber,
  MinLength,
} from 'class-validator';


export class RegisterDto {
  @ApiProperty({
    example: '+998901234567',
    description: 'Foydalanuvchining telefon raqami (unique)',
  })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: 'strongPassword123',
    minLength: 6,
    description: 'Foydalanuvchi paroli (kamida 6 ta belgi)',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'Bunyodbek G‘ulomjonov',
    description: 'Foydalanuvchining to‘liq ismi',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Profil rasmi (ixtiyoriy)',
  })
  @IsOptional()
  image?: string;
}
