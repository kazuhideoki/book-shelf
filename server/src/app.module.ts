import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DisplaySetsModule } from './2-resources/controllers/display-sets/display-sets.module';
import { FilesModule } from './2-resources/controllers/files/files.module';
import { ImageSetsModule } from './2-resources/controllers/image-sets/image-sets.module';
import { SelfController } from './2-resources/controllers/self/self.controller';
import { SelfModule } from './2-resources/controllers/self/self.module';
import { LoggerMiddleware } from './2-resources/middleware/logger-middleware';
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
