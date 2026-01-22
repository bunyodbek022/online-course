import { PartialType } from '@nestjs/swagger';
import { SubmitExamDto } from './create-exam-result.dto';

export class UpdateExamResultDto extends PartialType(SubmitExamDto) {}
