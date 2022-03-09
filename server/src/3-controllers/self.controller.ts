import { Controller, Get, Injectable, Scope, UseGuards } from '@nestjs/common';
import { ServerAuth } from '../../../type/model/auth';
import { AuthContext } from '../0-base/auth-context';
import { AuthGuard } from '../security/auth-guard';

@Controller('self')
@UseGuards(AuthGuard)
@Injectable({ scope: Scope.REQUEST })
export class SelfController {
  // constructor(readonly authContext: AuthContext) {}
  constructor(readonly authContext: AuthContext) {}

  @Get()
  self(): ServerAuth {
    return this.authContext.auth;
  }
}
