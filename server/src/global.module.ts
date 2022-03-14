import { Global, Module, Scope } from '@nestjs/common';
import { AuthContext } from './0-base/auth-context';
import { FirebaseSetting } from './0-base/firebase-setting';
import { AccountRepository } from './1-repositories/account.repository';

@Global()
@Module({
  providers: [
    AccountRepository,
    AuthContext,
    FirebaseSetting,
    {
      provide: 'AUTH_CONTEXT_INIT',
      useValue: {},
      scope: Scope.REQUEST,
    },
  ],
  exports: [
    AccountRepository,
    AuthContext,
    FirebaseSetting,
    {
      provide: 'AUTH_CONTEXT_INIT',
      useValue: {},
      scope: Scope.REQUEST,
    },
  ],
})
export class GlobalModule {}
