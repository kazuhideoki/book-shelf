import {
  Body,
  Controller,
  Get,
  Injectable,
  Post,
  Scope,
  UseGuards,
} from '@nestjs/common';
import { RegisterDispalySet } from '../../../type/api/firestore-display-set-api.type';
import { DisplaySet } from '../../../type/model/firestore-display-set.type';
import { AuthContext } from '../0-base/auth-context';
import { DisplaySetRepository } from '../1-repositories/display-set.repository';
import { AuthGuard } from '../security/auth-guard';

@Controller('display-sets')
@Injectable({ scope: Scope.REQUEST })
@UseGuards(AuthGuard)
export class DisplaySetController {
  constructor(
    private readonly displaySetService: DisplaySetRepository,
    private readonly authContext: AuthContext,
  ) {}

  @Get()
  getDisplaySets(): Promise<DisplaySet[]> {
    return this.displaySetService.list();
  }

  @Post()
  registerDisplaySet(@Body() data: RegisterDispalySet): Promise<DisplaySet> {
    return this.displaySetService.register(
      this.authContext.instance().auth.accountId,
      data,
    );
  }
}
