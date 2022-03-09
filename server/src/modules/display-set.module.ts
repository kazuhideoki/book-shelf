import { Module, Scope } from '@nestjs/common';
import { AuthContext } from '../0-base/auth-context';
import { FirebaseSetting } from '../0-base/initialize-firebaes';
import { AccountRepository } from '../1-repositories/account.repository';
import { DisplaySetRepository } from '../1-repositories/display-set.repository';
import { DisplaySetController } from '../3-controllers/display-set.controller';

@Module({
  controllers: [DisplaySetController],
  providers: [
    DisplaySetRepository,
    AccountRepository,
    FirebaseSetting,
    AuthContext,
    {
      provide: 'AUTH_CONTEXT_INIT',
      useValue: {},
      scope: Scope.REQUEST,
    },
  ],
})
export class DisplaySetModule {}
