import { User } from "@firebase/auth";
import { DriveAuth } from "./google-drive-auth.type";

export type UserAuth = Partial<User>;

export type AppUser = {
  userId: string;
  userAuth: User;
  driveAuth: DriveAuth;
  createdAt: Date;
  updatedAt: Date;
};
