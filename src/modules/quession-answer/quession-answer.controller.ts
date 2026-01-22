import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { QuestionAnswerService } from './quession-answer.service';
import { CreateQuestionAnswerDto } from './dto/create-quession-answer.dto';
import { UpdateQuessionAnswerDto } from './dto/update-quession-answer.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Question Answer')
@Controller('question-answer')
export class QuestionAnswerController {
  constructor(private readonly service: QuestionAnswerService) {}

  @ApiCookieAuth('access_token')
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Req() req, @Body() dto: CreateQuestionAnswerDto) {
    return this.service.create(req.user.id, dto);
  }

  @ApiCookieAuth('access_token')
  @UseGuards(AuthGuard)
  @Get('question/:questionId')
  findByQuestion(
    @Param('questionId') questionId: string,
  ) {
    return this.service.findByQuestionId(+questionId);
  }

  @ApiCookieAuth('access_token')
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateQuessionAnswerDto,
  ) {
    return this.service.update(+id, dto);
  }

  @ApiCookieAuth('access_token')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
