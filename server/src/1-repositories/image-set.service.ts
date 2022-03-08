import { ImageSet } from '../../../type/model/firestore-image-set.type';
import {
  collection,
  timestampFromDateRecursively,
  toData,
} from '../0-base/server-firebase';
import { BaseService } from '../2-services/base.service';

export class ImageSetService extends BaseService {
  async find(fileId: string): Promise<ImageSet> {
    const response = await toData<ImageSet>(
      collection('imageSets').doc(fileId).get(),
    ).catch((e) => {
      console.log({ e });
      throw e;
    });

    return response;
  }

  async register(fileId: string, data: ImageSet): Promise<void> {
    await collection('imageSets')
      .doc(fileId)
      .set(timestampFromDateRecursively(data))
      .catch((e) => console.log(`error occurred in firestore: ${e}`));
  }
}
