// dto/create-exam.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ExamAnswer } from '@prisma/client';

export class CreateExamDto {
  @ApiProperty({ example: 'What is NestJS?' })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({ example: 'Framework' })
  @IsString()
  variantA: string;

  @ApiProperty({ example: 'Library' })
  @IsString()
  variantB: string;

  @ApiProperty({ example: 'Database' })
  @IsString()
  variantC: string;

  @ApiProperty({ example: 'Language' })
  @IsString()
  variantD: string;

  @ApiProperty({ enum: ExamAnswer })
  @IsEnum(ExamAnswer)
  answer: ExamAnswer;

  @ApiProperty({ example: 1 })
  @IsInt()
  lessonGroupId: number;
}
