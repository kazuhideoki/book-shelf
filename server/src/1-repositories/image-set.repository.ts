import { Injectable, Scope } from '@nestjs/common';
import {
  timestampFromDateRecursively,
  toData,
} from '../0-base/firebase-helper';
import { FirebaseSetting } from '../0-base/firebase-setting';
import { ImageSet } from '../2-resources/controllers/image-sets/entities/image-set.entity';

@Injectable({ scope: Scope.REQUEST })
export class ImageSetRepository {
  constructor(private readonly firebase: FirebaseSetting) {}

  async find(fileId: string): Promise<ImageSet> {
    const response = await toData<ImageSet>(
      this.firebase.collection('imageSets').doc(fileId).get(),
    ).catch((e) => {
      console.log({ e });
      throw e;
    });

    return response;
  }

  async register(fileId: string, data: ImageSet): Promise<void> {
    await this.firebase
      .collection('imageSets')
      .doc(fileId)
      .set(timestampFromDateRecursively(data))
      .catch((e) => console.log(`error occurred in firestore: ${e}`));
  }
}
