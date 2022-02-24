import { atom } from "recoil";
import { DriveAuth } from "../../type/model/google-drive-auth.type";

export type DriveAuthState = { driveAuth?: DriveAuth; initialized: boolean };

export const driveAuthState = atom<DriveAuthState | undefined>({
  key: "driveAuth",
  default: { initialized: false },
});
