import { User } from "@firebase/auth";
import { DriveAuth } from "../../recoil/atom/drive-auth";

export type AppUser = {
  id?: string;
  userAuth?: User;
  driveAuth?: DriveAuth;
};
