import { Account } from "../../type/model/account";
import { BaseService } from "./base.service";
import {
  collection,
  timestampFromDateRecursively,
  toData,
} from "./server_firebase";

export class AccountService extends BaseService {
  async find(accountId: string): Promise<Account> {
    const response = await toData<Account>(
      collection("accounts").doc(accountId).get()
    ).catch((e) => {
      console.log({ e });
      throw e;
    });

    return response;
  }

  async findByEmail(email: string): Promise<Account> {
    const response = await toData<Account>(
      collection("accounts").where("email", "==", email).get()
    )
      .catch((e) => {
        console.log({ e });
        throw e;
      })
      .then((e) => e?.[0]);

    return response;
  }

  async register(data: Account): Promise<void> {
    await collection("accounts")
      .doc()
      .set(timestampFromDateRecursively(data))
      .catch((e) => console.log(`error occurred in firestore: ${e}`));
  }
}
