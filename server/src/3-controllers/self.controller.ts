import { Controller, Get } from '@nestjs/common';
import { AuthContext } from '../../../front/src/old-server/helper/auth-context';
import { ServerAuth } from '../../../type/model/auth';

@Controller('self')
export class SelfController {
  @Get()
  self(): ServerAuth {
    return AuthContext.instance.auth;
  }
}
