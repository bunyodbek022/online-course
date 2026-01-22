import { ApiProperty } from "@nestjs/swagger";
import { IsMobilePhone, IsPhoneNumber, IsString } from "class-validator";

export class ResetPhoneNumber{
    @ApiProperty({
        example: '+998507003613',
        description: 'Foydalanuvchining telefon raqami (unique)',
      })
    @IsPhoneNumber()
    @IsString()
      phone: string;
}