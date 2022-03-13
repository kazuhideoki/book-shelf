import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthContext } from '../0-base/auth-context';
import { LoggerMiddleware } from '../0-base/logger-middleware';
import { DriveFileRepository } from '../1-repositories/drive-file-repository';
import { ImageSetRepository } from '../1-repositories/image-set.repository';
import { StorageRepository } from '../1-repositories/storage-repository';
import { FileService } from '../2-services/file.service';
import { FileController } from '../3-controllers/file.controller';
import { DisplaySetsModule } from '../display-sets/display-sets.module';
import { SelfController } from '../self/self.controller';
import { GlobalModule } from './global.module';

console.log('app.module.ts');

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: `config/.env` }),
    // うまくいかない

    // SelfModule,
    // FileModule,
    DisplaySetsModule,
    GlobalModule,
  ],
  controllers: [SelfController, FileController],
  providers: [
    DriveFileRepository,
    ImageSetRepository,
    StorageRepository,
    FileService,
    AuthContext,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
