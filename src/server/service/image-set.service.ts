import { ImageSet } from "../../type/model/firestore-image-set.type";
import { BaseQuery } from "../helper/base-query";
import { BaseService } from "./base.service";
import {
  collection,
  timestampFromDateRecursively,
  toData,
} from "./server_firebase";

export type ImageSetQuery = {} & BaseQuery;

export class ImageSetService extends BaseService {
  async find(fileId: string): Promise<ImageSet> {
    const response = await toData<ImageSet>(
      collection("imageSets").doc(fileId).get()
    ).catch((e) => {
      console.log({ e });
      throw e;
    });

    return response;
  }

  async register(fileId: string, data: ImageSet): Promise<void> {
    await collection("imageSets")
      .doc(fileId)
      .set(timestampFromDateRecursively(data))
      .catch((e) => console.log(`error occurred in firestore: ${e}`));
  }
}
