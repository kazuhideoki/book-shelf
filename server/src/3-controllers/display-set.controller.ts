import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthContext } from '../../../front/src/old-server/helper/auth-context';
import { RegisterDispalySet } from '../../../type/api/firestore-display-set-api.type';
import { DisplaySet } from '../../../type/model/firestore-display-set.type';
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
