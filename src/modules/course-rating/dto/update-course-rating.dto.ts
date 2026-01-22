import { PartialType } from '@nestjs/swagger';
import { CreateRatingDto} from './create-course-rating.dto';

export class UpdateCourseRatingDto extends PartialType(CreateRatingDto) {}
