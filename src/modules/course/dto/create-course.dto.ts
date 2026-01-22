import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { CourseLevel } from '@prisma/client';

export class CreateCourseDto {
  @ApiProperty({ example: 'JavaScript Bootcamp' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Full stack JS development' })
  @IsString()
  about: string;

  @ApiProperty({ type: 'number', example: 150000 })
  @Type(() => Number) // String -> Number
  @IsNumber()
  price: number;

  @ApiProperty({ enum: CourseLevel, example: CourseLevel.BEGINNER })
  @IsEnum(CourseLevel)
  level: CourseLevel;

  @ApiProperty({ type: 'number', example: 1 })
  @Type(() => Number)
  @IsNumber()
  categoryId: number;

  @ApiProperty({ type: 'number', example: 5 })
  @Type(() => Number)
  @IsNumber()
  mentorId: number;

  @ApiProperty({ type: 'boolean', example: true })
  @Type(() => Boolean) 
  @IsBoolean()
  published: boolean;


  @ApiProperty({ type: 'string', format: 'binary' })
  banner: any;

  @ApiProperty({ type: 'string', format: 'binary' })
  introVideo: any;
}