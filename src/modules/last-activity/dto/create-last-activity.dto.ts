import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateLastActivityDto {
  @ApiPropertyOptional({ example: 'https://video-url.com/video.mp4' })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  courseId?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  groupId?: number;

  @ApiPropertyOptional({ example: 'uuid-lesson' })
  @IsOptional()
  @IsString()
  lessonId?: string;
}
