import { StoragePath } from '../../../front/src/old-server/helper/const';
import { NewAuthContext } from '../0-base/new-auth-context';
import { SettingServerFirebase } from '../0-base/setting-server-firebase';

export class StorageRepository {
  constructor(
    private readonly firebase: SettingServerFirebase,
    private readonly authContext: NewAuthContext,
  ) {}

  async save(fileId: string, data: Buffer) {
    await this.firebase.bucket
      .file(
        StoragePath.imageFile(
          this.authContext.instance().auth.accountId,
          fileId,
        ),
      )
      .save(data)
      .catch((e) => console.log(`error occurred in bucket.file: ${e}`));
  }

  async getSignedUrl(fileId: string, expires: Date): Promise<string> {
    return await this.firebase.bucket
      .file(
        StoragePath.imageFile(
          this.authContext.instance().auth.accountId,
          fileId,
        ),
      )
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
