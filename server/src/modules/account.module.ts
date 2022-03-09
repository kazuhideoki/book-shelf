import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { FirebaseSetting } from '../0-base/initialize-firebaes';
import { LoggerMiddleware } from '../0-base/logger-middleware';
import { AccountRepository } from '../1-repositories/account.repository';
import { SelfController } from '../3-controllers/self.controller';

console.log('account.module.ts');

@Module({
  controllers: [SelfController],
  providers: [AccountRepository, FirebaseSetting],
  exports: [AccountModule],
})
export class AccountModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
