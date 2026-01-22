import { PartialType } from '@nestjs/swagger';
import { CreateQuestionDto } from './create-quession.dto';

export class UpdateQuessionDto extends PartialType(CreateQuestionDto) {}
