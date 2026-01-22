import { PartialType } from '@nestjs/swagger';
import { CreateLessonViewDto } from './create-lesson-view.dto';

export class UpdateLessonViewDto extends PartialType(CreateLessonViewDto) {}
