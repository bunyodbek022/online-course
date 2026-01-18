import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/multer.config';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  register(
    @Body() payload: RegisterDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.register(payload, file);
  }

  @Post('login')
  login(@Body() payload: LoginUserDto, @Res() res: Response) {
    return this.usersService.login(payload, res);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async updateUser(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: UpdateUserDto,
  ) {
    return this.usersService.update(+id, payload, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
