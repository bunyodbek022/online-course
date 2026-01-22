import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class CreateLessonViewDto {
  @ApiProperty({ example: 'uuid-lesson' })
  @IsString()
  lessonId: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  view: boolean;
}
