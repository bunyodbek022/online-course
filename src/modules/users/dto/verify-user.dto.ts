import { ApiProperty } from "@nestjs/swagger";
import { IsPhoneNumber, IsString } from "class-validator";

export class VerifyUserDto {
  @ApiProperty({
    example: '+998901234567',
    description: 'Foydalanuvchining telefon raqami',
  })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: '123456',
    description: 'OYP code',
  })
  @IsString()
  code: string;
}
