import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { MyProfileService } from './my-profile.service';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { ApiCookieAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/multer/multer.options';
import { ResetPasswordDto } from '../users/dto/reset-password.dto';
import { ResetPhoneNumber } from './dto/reset-my-phone-number.dto';
import { VerifyPhoneChangeDto } from './dto/verify-newPhone.dto';

@Controller('my/profile')
export class MyProfileController {
  constructor(private readonly myProfileService: MyProfileService) {}

  @Post('logout')
  @ApiCookieAuth('access_token')
  @UseGuards(AuthGuard)
  logout(@Req() req) {
    return this.myProfileService.logout(req);
  }

  @Get('')
  @ApiCookieAuth('access_token')
  @UseGuards(AuthGuard)
  profile(@Req() req) {
    const id = req.user.id;
    return this.myProfileService.myProfile(+id);
  }

  @Patch('')
  @ApiCookieAuth('access_token')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image', multerOptions))
  update(@Body() payload: UpdateMyProfileDto, @Req() req,  @UploadedFile() file: Express.Multer.File,) {
    const id = req.user.id
    return this.myProfileService.update(+id, payload, file);
  }
  
  // RESET PASSWORD
  @Patch('reset-password')
  @UseGuards(AuthGuard)
    @ApiCookieAuth('access_token')
    @ApiOperation({ summary: 'Reset user password' })
    resetPassword(@Body() dto: ResetPasswordDto, @Req() req) {
      const id = req.user.id;
      return this.myProfileService.resetPassword(+id, dto);
  }
  
  @Patch('reset-number')
  @UseGuards(AuthGuard)
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Reset user phone number' })
  resetPhoneNumber(@Body() phone: ResetPhoneNumber, @Req() req) {
    const id = req.user.id
    return this.myProfileService.resetPhoneNumber(phone, id)
  }

  @Post('verify-phone')
    @ApiCookieAuth('access_token')
    @UseGuards(AuthGuard)
verifyPhoneChange(
  @Body() body: VerifyPhoneChangeDto,
  @Req() req,
) {
  return this.myProfileService.verifyPhoneChangeOtp(
    body.phone,
    body.code,
    req.user.id,
  );
}

}
