import { atom } from "recoil";

export type AuthResponse = {
  access_token: string;
  expires_in: string;
  refresh_token: string;
  scope: string;
  token_type: string;
};

export const driveAuthState = atom<AuthResponse | null>({
  key: "driveAuth",
  default: null,
});
