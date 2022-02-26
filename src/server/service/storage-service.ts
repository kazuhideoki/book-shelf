import { StoragePath } from "../helper/const";
import { BaseService } from "./base.service";
import { bucket } from "./server_firebase";

export class StorageService extends BaseService {
  async save(fileId: string, data: Buffer) {
    await bucket
      .file(StoragePath.imageFile(this.appUser.userId, fileId))
      .save(data)
      .catch((e) => console.log(`error occurred in bucket.file: ${e}`));
  }

  async getSignedUrl(fileId: string, expires: Date): Promise<string> {
    return (
      await bucket
        .file(StoragePath.imageFile(this.appUser.userId, fileId))
        .getSignedUrl({
          action: "read",
          expires,
        })
        .catch((e) => {
          console.log(`error occurred in getSignedUrl: ${e}`);
          throw e;
        })
    )[0];
  }
}
