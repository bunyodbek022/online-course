// dto/submit-exam.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt } from 'class-validator';

export class SubmitExamDto {
  @ApiProperty({
    example: [
      { examId: 1, answer: 'A' },
      { examId: 2, answer: 'C' },
    ],
  })
  @IsArray()
  answers: {
    examId: number;
    answer: string;
  }[];

  @ApiProperty({ example: 1 })
  @IsInt()
  lessonGroupId: number;
}
