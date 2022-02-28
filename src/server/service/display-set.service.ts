import { RegisterDispalySet } from "../../type/api/firestore-display-set-api.type";
import { DisplaySet } from "../../type/model/firestore-display-set.type";
import { BaseService } from "./base.service";
import { collection, toData } from "./server-firebase";

export class DisplaySetService extends BaseService {
  async list(): Promise<DisplaySet[]> {
    const auht = this.authContext;

    const response = await toData<DisplaySet>(
      collection("displaySets")
        .where("accountId", "==", this.authContext.auth.accountId)
        .get()
    ).catch((e) => {
      console.log({ e });
      throw e;
    });

    return response;
  }

  async register(data: RegisterDispalySet): Promise<void> {
    const ref = collection("displaySets").doc();

    const firebaseData: DisplaySet = {
      accountId: this.authContext.auth.accountId,
      displaySetId: ref.id,
      name: data.name,
      files: data.files,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await ref
      .set(firebaseData)
      .catch((e) => console.log(`error occurred in firestore: ${e}`));
  }
}
