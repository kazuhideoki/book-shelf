import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from '../0-base/logger-middleware';
import { DisplaySetsModule } from '../display-sets/display-sets.module';
import { FilesModule } from '../files/files.module';
import { ImageSetsModule } from '../image-sets/image-sets.module';
import { SelfController } from '../self/self.controller';
import { SelfModule } from '../self/self.module';
import { GlobalModule } from './global.module';

console.log('app.module.ts');

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: `config/.env` }),
    // うまくいかない

    SelfModule,
    FilesModule,
    ImageSetsModule,
    DisplaySetsModule,
    GlobalModule,
  ],
  controllers: [SelfController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
