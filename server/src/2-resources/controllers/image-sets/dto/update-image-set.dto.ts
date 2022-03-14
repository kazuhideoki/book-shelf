import { PartialType } from '@nestjs/mapped-types';
import { CreateImageSetDto } from './create-image-set.dto';

export class UpdateImageSetDto extends PartialType(CreateImageSetDto) {}
