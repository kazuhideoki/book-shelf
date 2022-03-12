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
import { AuthGuard } from '../security/auth-guard';
import { DisplaySetsService } from './display-sets.service';
import { CreateDisplaySetDto } from './dto/create-display-set.dto';
import { UpdateDisplaySetDto } from './dto/update-display-set.dto';

@Controller('display-sets')
@UseGuards(AuthGuard)
export class DisplaySetsController {
  constructor(private readonly displaySetsService: DisplaySetsService) {}

  @Post()
  create(@Body() createDisplaySetDto: CreateDisplaySetDto) {
    return this.displaySetsService.create(createDisplaySetDto);
  }

  @Get()
  findAll() {
    return this.displaySetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.displaySetsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDisplaySetDto: UpdateDisplaySetDto,
  ) {
    return this.displaySetsService.update(+id, updateDisplaySetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.displaySetsService.remove(+id);
  }
}
