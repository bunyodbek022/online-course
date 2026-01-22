import { PartialType } from '@nestjs/swagger';
import {PurchaseCourseDto } from './purchase-course.dto';

export class UpdatePurchaseCourseDto extends PartialType(
 PurchaseCourseDto,
) {}
