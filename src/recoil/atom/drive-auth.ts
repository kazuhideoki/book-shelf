import { atom } from "recoil";

export type DriveAuth = {
  access_token: string;
  expires_in: string;
  refresh_token: string;
  scope: string;
  token_type: string;
};

export const driveAuthState = atom<DriveAuth | null>({
  key: "driveAuth",
  default: null,
});
