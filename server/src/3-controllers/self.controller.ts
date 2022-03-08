import { Controller, Get } from '@nestjs/common';
import { AuthContext } from '../../../front/src/server/helper/auth-context';
import { ServerAuth } from '../../../type/model/auth';

@Controller('')
export class SelfController {
  @Get()
  self(): ServerAuth {
    return AuthContext.instance.auth;
  }
}
