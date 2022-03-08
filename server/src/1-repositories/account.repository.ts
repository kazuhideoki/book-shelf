import { Account } from '../../../type/model/account';
import {
  timestampFromDateRecursively,
  toData,
} from '../0-base/server-firebase';
import { SettingServerFirebase } from '../0-base/setting-server-firebase';

export class AccountRepository {
  constructor(private firebase: SettingServerFirebase) {}

  async initFind(email: string) {
    const response = await toData<Account>(
      this.firebase.collection('accounts').where('email', '==', email).get(),
    )
      .catch((e) => {
        console.log({ e });
        throw e;
      })
      .then((e) => e?.[0]);

    return response;
  }
  async find(accountId: string): Promise<Account> {
    const response = await toData<Account>(
      this.firebase.collection('accounts').doc(accountId).get(),
    ).catch((e) => {
      console.log({ e });
      throw e;
    });

    return response;
  }

  async findByEmail(email: string) {
    const response = await toData<Account>(
      this.firebase.collection('accounts').where('email', '==', email).get(),
    )
      .catch((e) => {
        console.log({ e });
        throw e;
      })
      .then((e) => e?.[0]);

    return response;
  }

  async create(data: Account): Promise<void> {
    await this.firebase
      .collection('accounts')
      .doc()
      .set(timestampFromDateRecursively(data))
      .catch((e) => console.log(`error occurred in firestore: ${e}`));
  }
}
