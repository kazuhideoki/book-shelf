import admin from "firebase-admin";

var serviceAccount = require("credentials.json");

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const firestore = app.firestore;
export const storage = app.storage;

export async function readAll(
  // q: firestore.Query
  q: admin.firestore.Query
): Promise<admin.firestore.DocumentSnapshot<any>[]> {
  const result: admin.firestore.DocumentSnapshot<any>[] = [];
  // q = q.orderBy(admin.firestore.FieldPath.documentId());

  const qss = await q.get();
  result.push(...qss.docs);

  return result;
}
