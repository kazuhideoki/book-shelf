import admin from "firebase-admin";
import {
  collection as firebaseCollection,
  getFirestore,
} from "firebase/firestore";

// var serviceAccount = require("/credentials.json");
var serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);

console.log({ serviceAccount });

const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET_NAME,
    })
  : admin.app();
console.log({ app });

export const firestore = admin.firestore(app);

console.log({ firestore });
export const db = getFirestore();
// export const firestore = app.firestore;
export const collection = (collectionName: CollectionName) =>
  firebaseCollection(db, collectionName);
export type CollectionName = "ImageSets" | "DisplaySets";

export const bucket = app
  .storage()
  .bucket(process.env.FIREBASE_STORAGE_BUCKET_NAME);
