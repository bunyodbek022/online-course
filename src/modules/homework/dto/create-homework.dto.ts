
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateHomeworkDto {
  @ApiProperty({ example: 'Solve tasks 1-5' })
  @IsString()
  @IsNotEmpty()
  task: string;

  @ApiProperty({ example: 'https://file.url/pdf', required: false })
  @IsString()
  @IsOptional()
  file?: string;

  @ApiProperty({ example: 'lesson-uuid' })
  @IsString()
  @IsNotEmpty()
  lessonId: string;
}
