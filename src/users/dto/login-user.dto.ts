import { ApiProperty } from "@nestjs/swagger";
import { IsPhoneNumber, IsString } from "class-validator";

export class LoginUserDto {
  @ApiProperty({
    example: '+998901234567',
    description: 'Foydalanuvchining telefon raqami',
  })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'Foydalanuvchi paroli',
  })
  @IsString()
  password: string;
}
