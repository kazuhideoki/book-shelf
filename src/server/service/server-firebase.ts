import admin, { firestore as firebaseFirestore } from "firebase-admin";

// var serviceAccount = require("/credentials.json");
var serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);

const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET_NAME,
    })
  : admin.app();

type CollectionName = "imageSets" | "displaySets" | "accounts";
export const collection = (collectionName: CollectionName) =>
  admin.firestore(app).collection(collectionName);

export function toData<T>(qss: firebaseFirestore.QuerySnapshot): T[];
export function toData<T>(
  pqss: Promise<firebaseFirestore.QuerySnapshot>
): Promise<T[]>;
export function toData<T>(dss: firebaseFirestore.DocumentSnapshot): T;
export function toData<T>(
  pdss: Promise<firebaseFirestore.DocumentSnapshot>
): Promise<T>;
export function toData<T>(
  ss:
    | firebaseFirestore.QuerySnapshot
    | Promise<firebaseFirestore.QuerySnapshot>
    | firebaseFirestore.DocumentSnapshot
    | Promise<firebaseFirestore.DocumentSnapshot>
): T[] | T {
  const process = (
    ss: firebaseFirestore.QuerySnapshot | firebaseFirestore.DocumentSnapshot
  ) => {
    if (ss instanceof firebaseFirestore.QuerySnapshot) {
      return ss.docs.map((dss) => ({
        id: dss.id,
        ...timestampToDateRecursively(dss.data()),
      }));
    } else {
      if (!ss.exists) return null as any;
      return {
        id: ss.id,
        ...timestampToDateRecursively(ss.data()),
      };
    }
  };

  if (ss.constructor?.name.match("Promise")) {
    return (ss as Promise<any>).then(process) as any;
  } else {
    return process(ss as any);
  }
}

export function timestampToDateRecursively(value: any): any {
  if (value == null) {
    return value;
  } else if (value.constructor === firebaseFirestore.Timestamp) {
    return value.toDate();
  } else if (Array.isArray(value)) {
    return value.map(timestampToDateRecursively);
  } else if (value.constructor === Object) {
    const converted: any = {};
    for (const key in value) {
      converted[key] = timestampToDateRecursively(value[key]);
    }
    return converted;
  } else {
    return value;
  }
}

export function timestampFromDateRecursively(value: any): any {
  if (value == null) {
    return value;
  } else if (value.constructor === Date) {
    return firebaseFirestore.Timestamp.fromDate(value);
  } else if (Array.isArray(value)) {
    return value.map(timestampFromDateRecursively);
  } else if (value.constructor === Object) {
    const converted: any = {};
    for (const key in value) {
      converted[key] = timestampFromDateRecursively(value[key]);
    }
    return converted;
  } else {
    return value;
  }
}

export const bucket = app
  .storage()
  .bucket(process.env.FIREBASE_STORAGE_BUCKET_NAME);
