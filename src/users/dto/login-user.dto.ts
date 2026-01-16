import { IsPhoneNumber, IsString } from 'class-validator';

export class LoginUserDto {
  @IsPhoneNumber()
  phone: string;

  @IsString()
  password: string;
}
