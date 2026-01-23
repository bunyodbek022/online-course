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
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/multer/multer.options';
import {
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { VerifyUserDto } from './dto/verify-user.dto';
import { RoleEnumDto } from './dto/role-enum.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: RegisterDto,
  })
  //  REGISTER
  @Post('register')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  register(
    @Body() payload: RegisterDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.register(payload, file);
  }

  
  @ApiBody({
    type: VerifyUserDto,
  })
  // VERIFY
  @Post('verify-otp')
  async verifyOtp(@Body() verify: VerifyUserDto) {
    return this.usersService.verifyOtp(verify.phone, verify.code);
  }
  
  // LOGIN
  @ApiBody({ type: LoginUserDto })
  @Post('login')
  login(@Body() payload: LoginUserDto, @Res() res: Response) {
    return this.usersService.login(payload, res);
  }

  // FIND ALL
  @Get()
  @ApiCookieAuth('access_token')
  @UseGuards(AuthGuard, RolesGuard)
  findAll(@Req() req) {
    const user = req.user;
    const isAdmin =
      user.role === UserRole.ADMIN || user.role === UserRole.ASSISTANT;
    if (!isAdmin) {
      throw new ForbiddenException(
        "Sizda boshqa foydalanuvchilarni ma'lumotlarini ko'rish huquqi yo'q",
      );
    }
    return this.usersService.findAll();
  }

  // FIND ONE
  @Get(':id')
  @ApiCookieAuth('access_token')
  @Roles(UserRole.ADMIN, UserRole.ASSISTANT)
  @UseGuards(AuthGuard, RolesGuard)
  findOne(@Param('id') id: string, @Req() req) {
    const user = req.user;
    const isAdmin =
      user.role === UserRole.ADMIN || user.role === UserRole.ASSISTANT;
    if (!isAdmin) {
      throw new ForbiddenException(
        "Sizda boshqa foydalanuvchi ma'lumotlarini ko'rish huquqi yo'q",
      );
    }
    return this.usersService.findOne(+id);
  }

  // ADD ROLE
  @Patch(':id/give-role')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: "Foydalanuvchiga role berish" })
  @ApiParam({ name: 'id', description: 'Foydalanuvchi ID raqami', example: 1 })
  @ApiCookieAuth('access_token')
  @Roles(UserRole.ADMIN, UserRole.ASSISTANT)
  @UseGuards(AuthGuard, RolesGuard)
  addMentor(@Param('id', ParseIntPipe) id: number, @Body() role: RoleEnumDto) {
    return this.usersService.giveRole(id, role);
  }


  // UPDATE USER
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
    const isAdmin =
      user.role === UserRole.ADMIN || user.role === UserRole.ASSISTANT;
    if (isAdmin || id == String(user.id)) {
      return this.usersService.update(+id, payload, file);
    } else {
      throw new ForbiddenException(
        "Sizda boshqa foydalanuvchi ma'lumotlarini o'zgartirish huquqi yo'q",
      );
    }
  }

  // DELETE PROFILE
  @Delete('delete-profile')
  @ApiCookieAuth('access_token')
  @UseGuards(AuthGuard, RolesGuard)
  SelfDelete(@Req() req) {
    const user = req.user;
    return this.usersService.remove(user.id);
  }

  // For admins
  @Delete('delete/:id')
  @ApiCookieAuth('access_token')
  @Roles(UserRole.ADMIN, UserRole.ASSISTANT)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param() id: string) {
    return this.usersService.remove(+id);
  }
}
