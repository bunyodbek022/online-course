import { PartialType, OmitType } from '@nestjs/mapped-types';
import { RegisterDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(RegisterDto, ['password', 'phone'] as const),
) {}
