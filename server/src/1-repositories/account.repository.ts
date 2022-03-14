import { Injectable, Scope } from '@nestjs/common';
import {
  timestampFromDateRecursively,
  toData,
} from '../0-base/firebase-helper';
import { FirebaseSetting } from '../0-base/firebase-setting';
import { Account } from '../0.5-entities/account.entity';

@Injectable({ scope: Scope.REQUEST })
export class AccountRepository {
  constructor(readonly firebase: FirebaseSetting) {}

  async findOrRegister(data: Account): Promise<Account> {
    const response = await toData<Account>(
      this.firebase
        .collection('accounts')
        .where('email', '==', data.email)
        .get(),
    );
    if (response.length > 0) {
      return response[0];
    }

    return await this.create(data);
  }

  async create(data: Account): Promise<Account> {
    await this.firebase
      .collection('accounts')
      .doc()
      .set(timestampFromDateRecursively(data))
      .catch((e) => console.log(`error occurred in firestore: ${e}`));

    return data;
  }
}
