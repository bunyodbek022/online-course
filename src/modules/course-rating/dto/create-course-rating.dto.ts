import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsNotEmpty, Min, Max, MinLength } from 'class-validator';

export class CreateRatingDto {
  @ApiProperty({ 
    example: 5, 
    description: 'Kursga berilgan baho (1 dan 5 gacha)',
    minimum: 1,
    maximum: 5 
  })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rate: number;

  @ApiProperty({ 
    example: "Ajoyib kurs, juda ko'p narsa o'rgandim!", 
    description: 'Kurs haqida fikr/izoh',
    minLength: 3
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: "Izoh kamida 3 ta belgidan iborat bo'lishi kerak" })
  comment: string;

  @ApiProperty({ example: 1, description: 'Kurs ID raqami' })
  @IsInt()
  @IsNotEmpty()
  courseId: number;
}