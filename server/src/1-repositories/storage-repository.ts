import { Injectable, Scope } from '@nestjs/common';
import { AuthContext } from '../0-base/auth-context';
import { FirebaseSetting } from '../0-base/firebase-setting';
import { StoragePath } from '../type/const';

@Injectable({ scope: Scope.REQUEST })
export class StorageRepository {
  constructor(
    private readonly firebase: FirebaseSetting,
    private readonly authContext: AuthContext,
  ) {}

  async save(fileId: string, data: Buffer) {
    await this.firebase
      .bucket()
      .file(StoragePath.imageFile(this.authContext.auth.accountId, fileId))
      .save(data)
      .catch((e) => console.log(`error occurred in bucket.file: ${e}`));
  }

  async getSignedUrl(fileId: string, expires: Date): Promise<string> {
    const response = (
      await this.firebase
        .bucket()
        .file(StoragePath.imageFile(this.authContext.auth.accountId, fileId))
        .getSignedUrl({
          action: 'read',
          expires,
        })
    )[0];

    return response;
  }
}
