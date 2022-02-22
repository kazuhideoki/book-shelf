import { firestore } from "firebase-admin";

export type ImageSetFS = {
  userId: string;
  fileId: string;
  path: string;
  expiredAt: firestore.Timestamp;
  createdAt: firestore.Timestamp;
  updatedAt: firestore.Timestamp;
};
export type ImageSet = {
  userId: string;
  fileId: string;
  path: string;
  expiredAt: Date;
  createdAt: Date;
  updatedAt: Date;
};
