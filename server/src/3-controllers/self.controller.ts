import { Controller, Get } from '@nestjs/common';
import { ServerAuth } from '../../../type/model/auth';
import { NewAuthContext } from '../0-base/new-auth-context';

@Controller('self')
export class SelfController {
  @Get()
  self(): ServerAuth {
    // return AuthContext.instance.auth;
    return NewAuthContext.instance().auth;
  }
}
