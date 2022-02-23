import admin, { firestore as store } from "firebase-admin";

// var serviceAccount = require("/credentials.json");
var serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);

const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET_NAME,
    })
  : admin.app();

export type CollectionName = "imageSets" | "displaySets" | "users";
export const collection = (collectionName: CollectionName) =>
  admin.firestore(app).collection(collectionName);

export function toData<T>(qss: store.QuerySnapshot): T[];
export function toData<T>(pqss: Promise<store.QuerySnapshot>): Promise<T[]>;
export function toData<T>(dss: store.DocumentSnapshot): T;
export function toData<T>(pdss: Promise<store.DocumentSnapshot>): Promise<T>;
export function toData<T>(
  ss:
    | store.QuerySnapshot
    | Promise<store.QuerySnapshot>
    | store.DocumentSnapshot
    | Promise<store.DocumentSnapshot>
): T[] | T {
  const process = (ss: store.QuerySnapshot | store.DocumentSnapshot) => {
    if (ss instanceof store.QuerySnapshot) {
      return ss.docs.map((dss) => ({
        id: dss.id,
        ...dss.data(),
      }));
    } else {
      if (!ss.exists) return null as any;
      return {
        id: ss.id,
        ...ss.data(),
      };
    }
  };

  if (ss.constructor?.name.match("Promise")) {
    return (ss as Promise<any>).then(process) as any;
  } else {
    return process(ss as any);
  }
}

export const storage = app.storage();
export const bucket = app
  .storage()
  .bucket(process.env.FIREBASE_STORAGE_BUCKET_NAME);
