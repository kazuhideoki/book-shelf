import admin from "firebase-admin";
import {
  collection as firebaseCollection,
  getFirestore,
} from "firebase/firestore";

// var serviceAccount = require("/credentials.json");
var serviceAccount = JSON.parse(process.env.GOOGOLE_DRIVE_API_CREDENTIALS!);

const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET_NAME,
    })
  : admin.app();

export const firestore = admin.firestore();

export const db = getFirestore();
// export const firestore = app.firestore;
export const collection = (collectionName: CollectionName) =>
  firebaseCollection(db, collectionName);
export type CollectionName = "ImageSets" | "DisplaySets";

export const bucket = app
  .storage()
  .bucket(process.env.FIREBASE_STORAGE_BUCKET_NAME);
