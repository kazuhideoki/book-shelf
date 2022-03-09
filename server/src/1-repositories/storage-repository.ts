import { StoragePath } from '../../../front/src/old-server/helper/const';
import { AuthContext } from '../0-base/auth-context';
import { SettingServerFirebase } from '../0-base/setting-server-firebase';

export class StorageRepository {
  constructor(private firebase: SettingServerFirebase) {}

  async save(fileId: string, data: Buffer) {
    await this.firebase.bucket
      .file(StoragePath.imageFile(AuthContext.instance.auth.accountId, fileId))
      .save(data)
      .catch((e) => console.log(`error occurred in bucket.file: ${e}`));
  }

  async getSignedUrl(fileId: string, expires: Date): Promise<string> {
    return await this.firebase.bucket
      .file(StoragePath.imageFile(AuthContext.instance.auth.accountId, fileId))
      .getSignedUrl({
        action: 'read',
        expires,
      })
      .catch((e) => {
        console.log(`error occurred in getSignedUrl: ${e}`);
        throw e;
      })[0];
  }
}
