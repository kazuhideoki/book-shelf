import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  Scope,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthContext } from '../0-base/auth-context';
import { FirebaseSetting } from '../0-base/initialize-firebaes';
import { LoggerMiddleware } from '../0-base/logger-middleware';
import { AccountRepository } from '../1-repositories/account.repository';
import { DisplaySetRepository } from '../1-repositories/display-set.repository';
import { DriveFileRepository } from '../1-repositories/drive-file-repository';
import { ImageSetRepository } from '../1-repositories/image-set.repository';
import { StorageRepository } from '../1-repositories/storage-repository';
import { FileService } from '../2-services/file.service';
import { DisplaySetController } from '../3-controllers/display-set.controller';
import { FileController } from '../3-controllers/file.controller';
import { SelfController } from '../3-controllers/self.controller';

console.log('app.module.ts');

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [DisplaySetController, FileController, SelfController],
  providers: [
    AccountRepository,
    DisplaySetRepository,
    DriveFileRepository,
    ImageSetRepository,
    StorageRepository,
    FileService,
    AuthContext,
    {
      provide: 'AUTH_CONTEXT_INIT',
      useValue: {},
      scope: Scope.REQUEST,
    },
    FirebaseSetting,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
