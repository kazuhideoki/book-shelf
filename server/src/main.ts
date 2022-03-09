import { NestFactory } from '@nestjs/core';
import { CustomExceptionFilter } from './0-base/http-exception-filter';
import { FirebaseSetting } from './0-base/initialize-firebaes';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const firebaseSetting = app.get(FirebaseSetting);
  firebaseSetting.init();

  app.useGlobalFilters(new CustomExceptionFilter());

  const port = Number(process.env.PORT) || 8080;

  await app.listen(port, '0.0.0.0');
  console.log(`listen port: ${port}`);
}
bootstrap();
