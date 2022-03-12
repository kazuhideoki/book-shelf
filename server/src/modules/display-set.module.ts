import { Module, Scope } from '@nestjs/common';
import { AuthContext } from '../0-base/auth-context';
import { AccountRepository } from '../1-repositories/account.repository';
import { DisplaySetRepository } from '../1-repositories/display-set.repository';
import { DisplaySetsController } from '../display-sets/display-sets.controller';

@Module({
  controllers: [DisplaySetsController],
  providers: [
    DisplaySetRepository,
    AccountRepository,
    AuthContext,
    {
      provide: 'AUTH_CONTEXT_INIT',
      useValue: {},
      scope: Scope.REQUEST,
    },
  ],
  // exports: [DisplaySetController],
})
export class DisplaySetModule {}
