import { Injectable, Scope } from '@nestjs/common';
import {
  timestampFromDateRecursively,
  toData,
} from '../0-base/firebase-helper';
import { FirebaseSetting } from '../0-base/firebase-setting';
import { Account } from '../type/model/account';

@Injectable({ scope: Scope.REQUEST })
export class AccountRepository {
  constructor(readonly firebase: FirebaseSetting) {}

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
