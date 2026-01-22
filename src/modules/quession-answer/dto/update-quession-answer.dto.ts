import { PartialType } from '@nestjs/swagger';
import { CreateQuestionAnswerDto } from './create-quession-answer.dto';

export class UpdateQuessionAnswerDto extends PartialType(CreateQuestionAnswerDto) {}
