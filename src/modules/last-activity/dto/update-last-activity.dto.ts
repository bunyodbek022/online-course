import { PartialType } from '@nestjs/swagger';
import { CreateLastActivityDto } from './create-last-activity.dto';

export class UpdateLastActivityDto extends PartialType(CreateLastActivityDto) {}
