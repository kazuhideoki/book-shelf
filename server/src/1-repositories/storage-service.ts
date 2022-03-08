import { AuthContext } from '../../../front/src/server/helper/auth-context';
import { StoragePath } from '../../../front/src/server/helper/const';
import { bucket } from '../0-base/server-firebase';

export class StorageRepository {
  async save(fileId: string, data: Buffer) {
    await bucket
      .file(StoragePath.imageFile(AuthContext.instance.auth.accountId, fileId))
      .save(data)
      .catch((e) => console.log(`error occurred in bucket.file: ${e}`));
  }

  async getSignedUrl(fileId: string, expires: Date): Promise<string> {
    return (
      await bucket
        .file(
          StoragePath.imageFile(AuthContext.instance.auth.accountId, fileId),
        )
        .getSignedUrl({
          action: 'read',
          expires,
        })
        .catch((e) => {
          console.log(`error occurred in getSignedUrl: ${e}`);
          throw e;
        })
    )[0];
  }
}
