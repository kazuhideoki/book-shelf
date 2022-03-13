import { Controller, Get, Injectable, Scope, UseGuards } from '@nestjs/common';
import { AuthContext } from '../0-base/auth-context';
import { AuthGuard } from '../security/auth-guard';
import { ServerAuth } from '../type/model/auth';

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
