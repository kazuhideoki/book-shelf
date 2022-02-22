import admin from "firebase-admin";

// var serviceAccount = require("/credentials.json");
var serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);

const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET_NAME,
    })
  : admin.app();

export const firestore = admin.firestore(app);

export type CollectionName = "ImageSets" | "DisplaySets";

export const storage = app.storage();
export const bucket = app
  .storage()
  .bucket(process.env.FIREBASE_STORAGE_BUCKET_NAME);
