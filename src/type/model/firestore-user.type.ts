import { User } from "@firebase/auth";
import { DriveAuth } from "../../recoil/atom/drive-auth";

export type AppUser = {
  userId: string;
  userAuth: User;
  driveAuth: DriveAuth;
  createdAt: Date;
  updatedAt: Date;
};
