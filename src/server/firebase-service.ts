import admin from "firebase-admin";

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

export type CollectionName = "ImageSets" | "DisplaySets";

export const bucket = app
  .storage()
  .bucket(process.env.FIREBASE_STORAGE_BUCKET_NAME);
