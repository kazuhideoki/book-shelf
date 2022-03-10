import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import admin from 'firebase-admin';
import { CollectionName } from './setting-server-firebase';

@Injectable()
export class FirebaseSetting {
  constructor(readonly configService: ConfigService) {}

  private defaultApp: admin.app.App;

  init() {
    console.log('init start');

    console.log({ processEnv: process.env });
    console.log({
      configServiceEnvPORT: this.configService.get<string>('PORT'),
    });

    const serviceAccount = JSON.parse(
      this.configService.get<string>('FIREBASE_SERVICE_ACCOUNT'),
    );

    this.defaultApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: this.configService.get<string>(
        'FIREBASE_STORAGE_BUCKET_NAME',
      ),
    });

    console.log('init end');
  }

  collection(collectionName: CollectionName) {
    if (!this.defaultApp) return;
    return admin.firestore(this.defaultApp).collection(collectionName);
  }

  bucket() {
    if (!this.defaultApp) return;
    return admin
      .storage(this.defaultApp)
      .bucket(process.env.FIREBASE_STORAGE_BUCKET_NAME);
  }
}
