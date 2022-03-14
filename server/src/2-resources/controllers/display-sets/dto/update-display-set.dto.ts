import { PartialType } from '@nestjs/mapped-types';
import { CreateDisplaySetDto } from './create-display-set.dto';

export class UpdateDisplaySetDto extends PartialType(CreateDisplaySetDto) {}
