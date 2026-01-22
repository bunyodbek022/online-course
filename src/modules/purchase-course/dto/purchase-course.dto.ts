import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, IsOptional } from 'class-validator';
import { PaidVia } from '@prisma/client';

export class PurchaseCourseDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  courseId: number;

  @ApiProperty({ example: 100 })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({ enum: PaidVia, example: 'CARD' })
  @IsEnum(PaidVia)
  paidVia: PaidVia;
}
