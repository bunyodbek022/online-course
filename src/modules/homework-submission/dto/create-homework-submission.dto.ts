import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateHomeworkSubmissionDto {
  @ApiProperty({ example: 'My answer text', required: false })
  @IsString()
  @IsOptional()
  text?: string;

  @ApiProperty({ example: 'https://file.url/docx' })
  @IsString()
  file: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  homeworkId: number;
}
