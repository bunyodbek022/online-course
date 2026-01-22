import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { HomeworkSubStatus } from '@prisma/client';

export class ReviewHomeworkSubmissionDto {
  @ApiProperty({ enum: HomeworkSubStatus })
  @IsEnum(HomeworkSubStatus)
  status: HomeworkSubStatus;

  @ApiProperty({ example: 'Good job, but improve formatting', required: false })
  @IsString()
  @IsOptional()
  reason?: string;
}
