import { ConfigService } from '@nestjs/config';
import admin from 'firebase-admin';

type CollectionName = 'imageSets' | 'displaySets' | 'accounts';

export class SettingServerFirebase {
  constructor(private configService: ConfigService) {
    // console.log('SettingServerFirebase');
    // var serviceAccount = JSON.parse(
    //   this.configService.get<string>('FIREBASE_SERVICE_ACCOUNT')!,
    // );
    // admin.initializeApp({
    //   credential: admin.credential.cert(serviceAccount),
    //   storageBucket: process.env.FIREBASE_STORAGE_BUCKET_NAME,
    // });
  }

  collection(collectionName: CollectionName) {
    return admin.firestore().collection(collectionName);
  }

  bucket = admin.storage().bucket(process.env.FIREBASE_STORAGE_BUCKET_NAME);
}
