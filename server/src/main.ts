import { NestFactory } from '@nestjs/core';
import { CustomExceptionFilter } from './0-base/http-exception-filter';
import { FirebaseSetting } from './0-base/initialize-firebaes';
import { AppModule } from './modules/app.module';

export type Env = {
  PORT: string;

  NEXT_PUBLIC_WEB_FRONT_URL: string;

  GOOGLE_DRIVE_API_CLIENT_SECRET: string;
  NEXT_PUBLIC_GOOGLE_DRIVE_API_CLIENT_ID: string;

  FIREBASE_STORAGE_BUCKET_NAME: string;
  FIREBASE_STORAGE_URL: string;

  FIREBASE_SERVICE_ACCOUNT: string;
};

// export const ENV: Env = process.env.RUN_ON_LOCAL
//   ? (process.env as any)
//   : // Cloud Run に環境変数を展開したもの
//     envConverter(process.env.ENV_IN_GCP_CLOUD_RUN as any);
export const ENV: Env = process.env as Env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const firebaseSetting = app.get(FirebaseSetting);
  firebaseSetting.init();

  app.useGlobalFilters(new CustomExceptionFilter());

  console.log({ envPort: ENV.PORT });
  const port = Number(ENV.PORT) || 8080;

  await app.listen(port, '0.0.0.0');
  console.log(`listen port: ${port}`);
}
bootstrap();
