import { firestore } from "firebase-admin";

export type UpdateImageSet = {
  userId: string;
  fileId: string;
  path: string;
  expiredAt: firestore.Timestamp;
  createdAt: firestore.Timestamp;
  updatedAt: firestore.Timestamp;
};
