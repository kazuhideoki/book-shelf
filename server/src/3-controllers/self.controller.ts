import { Controller, Get, Injectable, Scope, UseGuards } from '@nestjs/common';
import { ServerAuth } from '../../../type/model/auth';
import { NewAuthContext } from '../0-base/new-auth-context';
import { AuthGuard } from '../security/auth-guard';

@Controller('self')
@UseGuards(AuthGuard)
@Injectable({ scope: Scope.REQUEST })
export class SelfController {
  constructor(readonly authContext: NewAuthContext) {}

  @Get()
  self(): ServerAuth {
    return this.authContext.instance().auth;
  }
}
