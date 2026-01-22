// dto/create-lesson-file.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLessonFileDto {
  @ApiProperty({ example: 'https://file.url/pdf' })
  @IsString()
  @IsNotEmpty()
  file: string;

  @ApiProperty({ example: 'Lecture slides', required: false })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({ example: 'lesson-uuid' })
  @IsString()
  @IsNotEmpty()
  lessonId: string;
}
