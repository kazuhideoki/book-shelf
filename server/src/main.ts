import { NestFactory } from '@nestjs/core';
import * as admin from 'firebase-admin';
import { CollectionName } from './0-base/setting-server-firebase';
import { AppModule } from './modules/app.module';

console.log({ env: process.env });

export const Env = process.env;

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET_NAME,
});

export const collection = (collectionName: CollectionName) => {
  return admin.firestore().collection(collectionName);
};

export const bucket = admin
  .storage()
  .bucket(process.env.FIREBASE_STORAGE_BUCKET_NAME);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  // const configService: ConfigService = app.get(ConfigService);
  // const firebaseServiceAccount = configService.get('FIREBASE_SERVICE_ACCOUNT');

  // const serviceAccount = JSON.parse(firebaseServiceAccount);

  // // if (admin.app.length === 0) {
  // admin.initializeApp({
  //   credential: admin.credential.cert(serviceAccount),
  //   storageBucket: process.env.FIREBASE_STORAGE_BUCKET_NAME,
  // });
  // // }

  const port = Number(process.env.PORT) || 3000;

  await app.listen(port);
  console.log(`listen port: ${port}`);
}
bootstrap();
