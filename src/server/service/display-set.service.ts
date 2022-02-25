import { RegisterDispalySet } from "../../type/api/firestore-display-set-api.type";
import { DisplaySet } from "../../type/model/firestore-display-set.type";
import { BaseQuery } from "../helper/base-query";
import { BaseService } from "./base.service";
import { collection, toData } from "./server_firebase";

export type ImageSetQuery = {} & BaseQuery;

export class DisplaySetService extends BaseService {
  async list(): Promise<DisplaySet[]> {
    const response = await toData<DisplaySet>(
      collection("displaySets").where("userId", "==", this.appUser.userId).get()
    ).catch((e) => {
      console.log({ e });
      throw e;
    });

    return response;
  }

  async register(data: RegisterDispalySet): Promise<void> {
    const ref = collection("displaySets").doc();

    const firebaseData: DisplaySet = {
      userId: this.appUser.userId,
      displaySetId: ref.id,
      files: data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await ref
      .set(firebaseData)
      .catch((e) => console.log(`error occurred in firestore: ${e}`));
  }
}
