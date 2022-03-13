import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import admin from 'firebase-admin';
import { ENV } from '../main';

export type CollectionName = 'imageSets' | 'displaySets' | 'accounts';

@Injectable()
export class FirebaseSetting {
  constructor(readonly configService: ConfigService) {}

  private defaultApp: admin.app.App;

  init() {
    console.log('init start');

    console.log({ ENV: ENV });
    console.log({ FIREBASE_SERVICE_ACCOUNT: ENV.FIREBASE_SERVICE_ACCOUNT });

    const serviceAccount = JSON.parse(
      this.configService.get<string>('FIREBASE_SERVICE_ACCOUNT'),
    );

    this.defaultApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: this.configService.get<string>(
        'FIREBASE_STORAGE_BUCKET_NAME',
      ),
      // storageBucket: ENV.FIREBASE_STORAGE_BUCKET_NAME,
    });

    console.log('init end');
  }

  collection(collectionName: CollectionName) {
    if (!this.defaultApp) return;
    return admin.firestore(this.defaultApp).collection(collectionName);
  }

  bucket() {
    if (!this.defaultApp) return;
    return (
      admin
        .storage(this.defaultApp)
        // .bucket(ENV.FIREBASE_STORAGE_BUCKET_NAME);
        .bucket(this.configService.get<string>('FIREBASE_STORAGE_BUCKET_NAME'))
    );
  }
}
