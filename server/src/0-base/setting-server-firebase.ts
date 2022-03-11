import { ConfigService } from '@nestjs/config';
import admin from 'firebase-admin';
import { ENV } from '../main';

export type CollectionName = 'imageSets' | 'displaySets' | 'accounts';

export class SettingServerFirebase {
  constructor(private readonly configService = new ConfigService()) {}

  collection(collectionName: CollectionName) {
    return admin.firestore().collection(collectionName);
  }

  bucket = admin.storage().bucket(ENV.FIREBASE_STORAGE_BUCKET_NAME);
}
