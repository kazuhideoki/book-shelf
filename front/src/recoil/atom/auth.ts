import { atom } from "recoil";
import { FrontAuth } from "../../../../server/src/type/model/auth";

export type AuthState = { auth?: FrontAuth; initialized: boolean };

export const authState = atom<AuthState>({
  key: "authState",
  default: {
    initialized: false,
  },
});
