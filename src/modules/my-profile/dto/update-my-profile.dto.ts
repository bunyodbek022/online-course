import { PartialType, OmitType } from '@nestjs/mapped-types';
import { RegisterDto } from 'src/modules/users/dto/create-user.dto';

export class UpdateMyProfileDto extends PartialType(
  OmitType(RegisterDto, ['password', 'phone'] as const),
) {}

 