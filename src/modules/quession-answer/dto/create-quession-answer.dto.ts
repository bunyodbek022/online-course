import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateQuestionAnswerDto {
  @ApiProperty({ example: 'Bu savolga javob matni' })
  @IsString()
  text: string;

  @ApiPropertyOptional({ example: 'answer.pdf' })
  @IsOptional()
  @IsString()
  file?: string;

  @ApiProperty({ example: 12 })
  @IsInt()
  questionId: number;
}
