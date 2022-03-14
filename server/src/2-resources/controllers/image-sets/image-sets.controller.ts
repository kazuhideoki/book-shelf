import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../../guards/auth-guard';
import { CreateImageSetDto } from './dto/create-image-set.dto';
import { UpdateImageSetDto } from './dto/update-image-set.dto';
import { ImageSetsService } from './image-sets.service';

@Controller('image-sets')
@UseGuards(AuthGuard)
export class ImageSetsController {
  constructor(private readonly imageSetsService: ImageSetsService) {}

  @Post()
  create(@Body() createImageSetDto: CreateImageSetDto) {
    return this.imageSetsService.create(createImageSetDto);
  }

  @Get()
  findAll() {
    return this.imageSetsService.findAll();
  }

  @Get(':fileId')
  findOne(@Param('fileId') fileId: string) {
    return this.imageSetsService.findImageSet(fileId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateImageSetDto: UpdateImageSetDto,
  ) {
    return this.imageSetsService.update(+id, updateImageSetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageSetsService.remove(+id);
  }
}
