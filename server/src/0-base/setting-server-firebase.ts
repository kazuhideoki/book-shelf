import { ConfigService } from '@nestjs/config';
import admin from 'firebase-admin';

export type CollectionName = 'imageSets' | 'displaySets' | 'accounts';

export class SettingServerFirebase {
  constructor(private readonly configService = new ConfigService()) {}

  collection(collectionName: CollectionName) {
    return admin.firestore().collection(collectionName);
  }

  bucket = admin.storage().bucket(process.env.FIREBASE_STORAGE_BUCKET_NAME);
}
