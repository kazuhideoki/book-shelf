import { Controller, Get, Injectable, Scope, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthContext } from '../../../0-base/auth-context';
import { ServerAuth } from '../../../type/model/auth.dto';
import { AuthGuard } from '../../guards/auth-guard';

@ApiBearerAuth()
@Controller('self')
@UseGuards(AuthGuard)
@Injectable({ scope: Scope.REQUEST })
export class SelfController {
  constructor(readonly authContext: AuthContext) {}

  @Get()
  self(): ServerAuth {
    return this.authContext.auth;
  }
}
