import { firestore as firebaseFirestore } from "firebase-admin";
import { AppUser } from "../model/firestore-user.type";

export type UpdateAppUser = Pick<
  AppUser,
  "userAuth" | "driveAuth" | "userId"
> & {
  createdAt?: firebaseFirestore.Timestamp;
  updatedAt: firebaseFirestore.Timestamp;
};
