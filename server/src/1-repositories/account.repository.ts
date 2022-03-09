import { Account } from '../../../type/model/account';
import { collection } from '../0-base/initialize-firebaes';
import {
  timestampFromDateRecursively,
  toData,
} from '../0-base/server-firebase';

export class AccountRepository {
  async initFind(email: string) {
    const response = await toData<Account>(
      collection('accounts').where('email', '==', email).get(),
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
      collection('accounts').doc(accountId).get(),
    ).catch((e) => {
      console.log({ e });
      throw e;
    });

    return response;
  }

  async findByEmail(email: string) {
    const response = await toData<Account>(
      collection('accounts').where('email', '==', email).get(),
    )
      .catch((e) => {
        console.log({ e });
        throw e;
      })
      .then((e) => e?.[0]);

    return response;
  }

  async create(data: Account): Promise<void> {
    await collection('accounts')
      .doc()
      .set(timestampFromDateRecursively(data))
      .catch((e) => console.log(`error occurred in firestore: ${e}`));
  }
}
