import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({ example: 'Bu mavzuni tushunmadim' })
  @IsString()
  text: string;

  @ApiProperty({ example: 'file.pdf', required: false })
  @IsOptional()
  @IsString()
  file?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  courseId: number;
}
