import { Injectable, Scope } from '@nestjs/common';
// import { collection } from '../main';
import { FirebaseSetting } from '../0-base/initialize-firebaes';
import { toData } from '../0-base/server-firebase';
import { DisplaySet } from '../type/model/firestore-display-set.type';

@Injectable({ scope: Scope.REQUEST })
export class DisplaySetRepository {
  constructor(readonly firebase: FirebaseSetting) {}

  async list(q?: { accountId?: string }): Promise<DisplaySet[]> {
    const cr = this.firebase.collection('displaySets');
    let qr: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;

    if (q?.accountId) {
      qr = cr.where('accountId', '==', q.accountId);
    }

    return await toData<DisplaySet>((qr ?? cr).get());
  }

  async register(data: DisplaySet): Promise<DisplaySet> {
    await this.firebase
      .collection('displaySets')
      .doc(data.displaySetId)
      .create(data)
      .catch((e) => console.log(`error occurred in firestore: ${e}`));

    return data;
  }
}
