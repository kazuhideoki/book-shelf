import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  // const port = Number(process.env.PORT) || 3000;

  // console.log(`listen port: ${port}`);

  // await app.listen(port);
}
bootstrap();
