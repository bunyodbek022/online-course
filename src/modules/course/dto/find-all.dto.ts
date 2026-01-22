import { ApiPropertyOptional } from '@nestjs/swagger';
import { CourseLevel } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CourseQueryDto {
  @ApiPropertyOptional({ example: 0, description: 'Skip qilinadigan elementlar soni' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset?: number = 0;

  @ApiPropertyOptional({ example: 10, description: 'Olinadigan elementlar soni' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Qidiruv matni (nomi yoki haqida)' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: CourseLevel, description: 'Kurs darajasi' })
  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;

  @ApiPropertyOptional({ description: 'Kategoriya ID raqami' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  category_id?: number;

  @ApiPropertyOptional({ description: 'Mentor ID raqami' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  mentor_id?: number;

  @ApiPropertyOptional({ description: 'Minimal narx' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  price_min?: number;

  @ApiPropertyOptional({ description: 'Maximal narx' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  price_max?: number;

  @ApiPropertyOptional({ type: 'boolean', description: 'Eʼlon qilinganmi?' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  published?: boolean;
}