import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as admin from 'firebase-admin';
import { AppModule } from './modules/app.module';

admin.initializeApp();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port = Number(process.env.PORT) || 3000;

  // var serviceAccount = JSON.parse(
  //   configService.get<string>('FIREBASE_SERVICE_ACCOUNT')!,
  // );

  // admin.initializeApp({
  //   credential: admin.credential.cert(serviceAccount),
  //   storageBucket: process.env.FIREBASE_STORAGE_BUCKET_NAME,
  // });

  await app.listen(port);
  console.log(`listen port: ${port}`);
}
bootstrap();
