import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLessonDto {
  @ApiProperty({ example: 'Lesson 1' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Lesson about topic' })
  @IsNotEmpty()
  @IsString()
  about: string;

  @ApiProperty({ example: 3 })
  @IsNotEmpty()
  @IsInt()
@Transform(({ value }) => parseInt(value, 10))
  groupId: number;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  video: any; 
}
