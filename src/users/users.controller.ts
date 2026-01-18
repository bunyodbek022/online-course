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
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/multer.config';
import { ApiBody, ApiConsumes, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { access } from 'fs';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: RegisterDto,
  })
  @Post('register')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  register(
    @Body() payload: RegisterDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.register(payload, file);
  }

  @ApiBody({ type: LoginUserDto })
  @Post('login')
  login(@Body() payload: LoginUserDto, @Res() res: Response) {
    return this.usersService.login(payload, res);
  }

  @Get()
  @ApiCookieAuth('access_token')
  @UseGuards(AuthGuard, RolesGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiCookieAuth('access_token')
  @UseGuards(AuthGuard, RolesGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiCookieAuth('access_token')
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async updateUser(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: UpdateUserDto,
  ) {
    return this.usersService.update(+id, payload, file);
  }

  @Delete('logout')
  @ApiCookieAuth('access_token')
  @UseGuards(AuthGuard, RolesGuard)
  logout(@Res() res) {
    return this.usersService.logout(res);
  }

  @Delete('delete-profile')
  @ApiCookieAuth('access_token')
  @UseGuards(AuthGuard, RolesGuard)
  SelfDelete(@Res() res) {
    const user = res.user
    return this.usersService.remove(user.id)
  }
  
  // For admins
  @Delete('delete/:id')
  @ApiCookieAuth('access_token')
  @Roles(UserRole.ADMIN, UserRole.ASSISTANT)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param() id : string) {
    return this.usersService.remove(+id)
  }
}
