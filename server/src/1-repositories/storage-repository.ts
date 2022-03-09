import { Injectable } from '@nestjs/common';
import { StoragePath } from '../../../front/src/utils/const';
import { AuthContext } from '../0-base/auth-context';
import { FirebaseSetting } from '../0-base/initialize-firebaes';

@Injectable()
export class StorageRepository {
  constructor(
    private readonly firebase: FirebaseSetting,
    private readonly authContext: AuthContext,
  ) {}

  async save(fileId: string, data: Buffer) {
    await this.firebase
      .bucket()
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
    return await this.firebase
      .bucket()
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
