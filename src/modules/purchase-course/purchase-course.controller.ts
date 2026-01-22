import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { PurchasedCourseService } from './purchase-course.service';
import { PurchaseCourseDto } from './dto/purchase-course.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Purchased Courses')
@ApiCookieAuth('access_token')
@Controller('purchased-courses')
export class PurchasedCourseController {
  constructor(private readonly service: PurchasedCourseService) {}


  @Post()
  @Roles(UserRole.STUDENT)
  @UseGuards(AuthGuard, RolesGuard)
  purchase(@Body() dto: PurchaseCourseDto, @Req() req) {
    return this.service.purchase(req.user.id, dto);
  }


  @Get('my')
  @Roles(UserRole.STUDENT)
  @UseGuards(AuthGuard, RolesGuard)
  myPurchased(@Req() req) {
    return this.service.myPurchasedCourses(req.user.id);
  }
}
