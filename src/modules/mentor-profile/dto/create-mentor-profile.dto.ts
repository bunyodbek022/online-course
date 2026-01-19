import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class CreateMentorProfileDto {
  @ApiPropertyOptional({ example: 'Frontend developer with 5 years experience' })
  @IsOptional()
  @IsString()
  about?: string;

  @ApiPropertyOptional({ example: 'Software Engineer' })
  @IsOptional()
  @IsString()
  job?: string;

  @ApiPropertyOptional({ example: 5, description: 'Years of experience' })
  @IsInt()
  @Min(0)
  experience: number;

  @ApiPropertyOptional({ example: '@bunyodbek', description: 'Telegram username' })
  @IsOptional()
  @IsString()
  telegram?: string;

  @ApiPropertyOptional({ example: '@bunyodbek', description: 'Instagram username' })
  @IsOptional()
  @IsString()
  instagram?: string;

  @ApiPropertyOptional({ example: 'https://linkedin.com/in/bunyodbek' })
  @IsOptional()
  @IsString()
  linkedin?: string;

  @ApiPropertyOptional({ example: 'https://facebook.com/bunyodbek' })
  @IsOptional()
  @IsString()
  facebook?: string;

  @ApiPropertyOptional({ example: 'https://github.com/bunyodbek' })
  @IsOptional()
  @IsString()
  github?: string;

  @ApiPropertyOptional({ example: 'https://bunyodbek.dev' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ example: 1, description: 'User ID' })
  @IsInt()
  userId: number;
}
