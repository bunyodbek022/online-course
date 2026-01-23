import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';

@ApiTags('Category')
@Controller('course-category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiCookieAuth('access_token')
  @Roles(UserRole.ADMIN, UserRole.ASSISTANT, UserRole.MENTOR)
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Get('all')
  findAll() {
    return this.categoryService.findAll();
  }

  @Get('single/:id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  @ApiCookieAuth('access_token')
  @Roles(UserRole.ADMIN, UserRole.ASSISTANT, UserRole.MENTOR)
  @UseGuards(AuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoryService.update(+id, dto);
  }

  @Delete(':id')
  @ApiCookieAuth('access_token')
  @Roles(UserRole.ADMIN, UserRole.ASSISTANT, UserRole.MENTOR)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
