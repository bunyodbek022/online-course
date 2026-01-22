import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { LastActivityService } from './last-activity.service';
import { CreateLastActivityDto } from './dto/create-last-activity.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Last Activity')
@ApiCookieAuth('access_token')
@Controller('last-activity')
export class LastActivityController {
  constructor(private readonly service: LastActivityService) {}

  @Patch()
  @Roles(UserRole.STUDENT, UserRole.ADMIN, UserRole.MENTOR)
  @UseGuards(AuthGuard, RolesGuard)
  upsert(@Body() dto: CreateLastActivityDto, @Req() req) {
    return this.service.upsert(req.user.id, dto);
  }


  @Get('me')
  @Roles(UserRole.STUDENT, UserRole.ADMIN, UserRole.MENTOR)
  @UseGuards(AuthGuard, RolesGuard)
  myActivity(@Req() req) {
    return this.service.findByUser(req.user.id);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @UseGuards(AuthGuard, RolesGuard)
  allActivities() {
    return this.service.findAll();
  }

  @Get(':userId')
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @UseGuards(AuthGuard, RolesGuard)
  findByUser(@Param('userId') userId: string) {
    return this.service.findByUser(+userId);
  }
}
