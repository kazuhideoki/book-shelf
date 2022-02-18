import admin from "firebase-admin";

var serviceAccount = require("/credentials.json");

const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET_NAME,
    })
  : admin.app();

export const firestore = app.firestore;
// export const bucket = new Storage().bucket(
//   process.env.FIREBASE_STORAGE_BUCKET_NAME
// );
export const bucket = app
  .storage()
  .bucket(process.env.FIREBASE_STORAGE_BUCKET_NAME);
// const storage = new Storage();
// export async function createBucket() {
//   // Creates the new bucket
//   return
//   console.log(`Bucket ${process.env.FIREBASE_STORAGE_BUCKET_NAME} created.`);
// }

export async function readAll(
  q: admin.firestore.Query
): Promise<admin.firestore.DocumentSnapshot<any>[]> {
  const result: admin.firestore.DocumentSnapshot<any>[] = [];

  const qss = await q.get();
  result.push(...qss.docs);

  return result;
}
