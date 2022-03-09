import { NestFactory } from '@nestjs/core';
import * as admin from 'firebase-admin';
import { CollectionName } from './0-base/setting-server-firebase';
import { AppModule } from './modules/app.module';
import { AuthGuard } from './security/authentication';

console.log({ FIREBASE_SERVICE_ACCOUNT: process.env.FIREBASE_SERVICE_ACCOUNT });

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);
console.log({ serviceAccount });

console.log(!admin.app.length);

// if (admin.app.length === 0) {
console.log('init firebase');

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET_NAME,
});
// }

console.log({ app });

export const collection = (collectionName: CollectionName) => {
  return admin.firestore(admin.app()).collection(collectionName);
};

export const bucket = admin
  .storage(admin.app())
  .bucket(process.env.FIREBASE_STORAGE_BUCKET_NAME);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalGuards(new AuthGuard());

  const port = Number(process.env.PORT) || 3000;

  await app.listen(port);
  console.log(`listen port: ${port}`);
}
bootstrap();
