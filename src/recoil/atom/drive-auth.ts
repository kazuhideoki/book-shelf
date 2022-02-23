import { atom } from "recoil";

export type DriveAuth = {
  access_token: string;
  expires_in: string;
  refresh_token: string;
  scope: string;
  token_type: string;
};

export type DriveAuthState = { driveAuth?: DriveAuth; initialized: boolean };

export const driveAuthState = atom<DriveAuthState | undefined>({
  key: "driveAuth",
  default: { initialized: false },
});
