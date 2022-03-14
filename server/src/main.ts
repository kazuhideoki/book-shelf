import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FirebaseSetting } from './0-base/firebase-setting';
import { CustomExceptionFilter } from './2-resources/filters/http-exception-filter';
import { swaggerSettings } from './2-resources/utils/swagger-setting';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  const configService = app.get(ConfigService);

  const firebaseSetting = app.get(FirebaseSetting);
  firebaseSetting.init();

  app.useGlobalFilters(new CustomExceptionFilter());

  const port = configService.get('PORT') || 8080;

  const serverUrl = configService.get<string>('NEXT_PUBLIC_WEB_SERVICE_URL');
  swaggerSettings(app, serverUrl, port);

  await app.listen(port, '0.0.0.0');
  console.log(`listen port: ${port}`);
}
bootstrap();
