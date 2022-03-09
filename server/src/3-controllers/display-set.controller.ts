import { Body, Controller, Get, Post } from '@nestjs/common';
import { RegisterDispalySet } from '../../../type/api/firestore-display-set-api.type';
import { DisplaySet } from '../../../type/model/firestore-display-set.type';
import { AuthContext } from '../0-base/auth-context';
import { DisplaySetRepository } from '../1-repositories/display-set.repository';

@Controller('display-sets')
export class DisplaySetController {
  constructor(private readonly displaySetService: DisplaySetRepository) {}

  @Get()
  getDisplaySets(): Promise<DisplaySet[]> {
    return this.displaySetService.list();
  }

  @Post()
  registerDisplaySet(@Body() data: RegisterDispalySet): Promise<DisplaySet> {
    return this.displaySetService.register(
      AuthContext.instance.auth.accountId,
      data,
    );
  }
}
