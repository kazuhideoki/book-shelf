import { RegisterDispalySet } from '../../../type/api/firestore-display-set-api.type';
import { DisplaySet } from '../../../type/model/firestore-display-set.type';
import { collection, toData } from '../0-base/server-firebase';

export class DisplaySetRepository {
  async list(q: { accountId?: string }): Promise<DisplaySet[]> {
    const cr = collection('displaySets');
    let qr: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;

    if (q.accountId) {
      qr = cr.where('accountId', '==', q.accountId);
    }

    return await toData<DisplaySet>((qr ?? cr).get());
  }

  async register(
    accountId: string,
    data: RegisterDispalySet,
  ): Promise<DisplaySet> {
    const ref = collection('displaySets').doc();

    const firebaseData: DisplaySet = {
      accountId,
      displaySetId: ref.id,
      name: data.name,
      files: data.files,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await ref
      .set(firebaseData)
      .catch((e) => console.log(`error occurred in firestore: ${e}`));

    return firebaseData;
  }
}
