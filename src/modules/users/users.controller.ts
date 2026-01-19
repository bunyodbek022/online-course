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
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/multer.config';
import { ApiBody, ApiConsumes, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { VerifyUserDto } from './dto/verify-user.dto';

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


  @ApiBody({
    type: VerifyUserDto
  })
  @Post('verify-otp')
  async verifyOtp(@Body() verify: VerifyUserDto) {
    return this.usersService.verifyOtp(verify.phone, verify.code);
  }

  @ApiBody({ type: LoginUserDto })
  @Post('login')
  login(@Body() payload: LoginUserDto, @Res() res: Response) {
    return this.usersService.login(payload, res);
  }
  
  @Post('logout')
  @ApiCookieAuth('access_token')
  @UseGuards(AuthGuard, RolesGuard)
  logout(@Req() req) {
    return this.usersService.logout(req);
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
    
  updateUser(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: UpdateUserDto,
    @Req() req,
  ) {
    const user = req.user;
    const isAdmin = user.role === UserRole.ADMIN || user.role === UserRole.ASSISTANT;
    if (!isAdmin && id !== String(user.id)) {
      throw new ForbiddenException(
        "Sizda boshqa foydalanuvchi ma'lumotlarini o'zgartirish huquqi yo'q",
      );
    }
    return this.usersService.update(+id, payload, file);
  }


  @Delete('delete-profile')
  @ApiCookieAuth('access_token')
  @UseGuards(AuthGuard, RolesGuard)
  SelfDelete(@Req() req) {
    const user = req.user
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
