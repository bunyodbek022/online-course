import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MentorProfileService } from './mentor-profile.service';
import { CreateMentorProfileDto } from './dto/create-mentor-profile.dto';
import { UpdateMentorProfileDto } from './dto/update-mentor-profile.dto';
import { ApiCookieAuth } from '@nestjs/swagger';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';

@Controller('mentor-profile')
export class MentorProfileController {
  constructor(private readonly mentorProfileService: MentorProfileService) {}

  @Post()
  @ApiCookieAuth('access_token')
  @Roles(UserRole.ADMIN, UserRole.ASSISTANT, UserRole.MENTOR)
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() payload: CreateMentorProfileDto) {
    return this.mentorProfileService.create(payload);
  }

  @Get()
  @ApiCookieAuth('access_token')
  @Roles(UserRole.ADMIN, UserRole.ASSISTANT, UserRole.MENTOR)
  @UseGuards(AuthGuard, RolesGuard)
  findAll() {
    return this.mentorProfileService.findAll();
  }

  @Get(':id')
  @ApiCookieAuth('access_token')
  @Roles(UserRole.ADMIN, UserRole.ASSISTANT, UserRole.MENTOR)
  @UseGuards(AuthGuard, RolesGuard)
  findOne(@Param('id') id: string) {
    return this.mentorProfileService.findOne(+id);
  }

  @Patch(':id')
  @ApiCookieAuth('access_token')
  @Roles(UserRole.ADMIN, UserRole.ASSISTANT, UserRole.MENTOR)
  @UseGuards(AuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() payload: UpdateMentorProfileDto) {
    return this.mentorProfileService.update(+id, payload);
  }

  @Delete(':id')
  @ApiCookieAuth('access_token')
  @Roles(UserRole.ADMIN, UserRole.ASSISTANT, UserRole.MENTOR)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.mentorProfileService.remove(+id);
  }
}
