import { Body, Controller, Get, Post } from '@nestjs/common';
import { RegisterDispalySet } from '../../../type/api/firestore-display-set-api.type';
import { DisplaySet } from '../../../type/model/firestore-display-set.type';
import { DisplaySetService } from '../1-repositories/display-set.service';

@Controller('display-sets')
export class AppController {
  constructor(private readonly displaySetService: DisplaySetService) {}

  @Get()
  getDisplaySets(): Promise<DisplaySet[]> {
    return this.displaySetService.list();
  }

  @Post()
  registerDisplaySet(@Body() data: RegisterDispalySet): Promise<DisplaySet> {
    return this.displaySetService.register(data);
  }
}
