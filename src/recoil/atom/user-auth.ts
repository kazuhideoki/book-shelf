import { User } from "@firebase/auth";
import { atom } from "recoil";

export type UserAuth = Partial<User>;
export type UserAuthState = { userAuth?: Partial<User>; initialized: boolean };

export const userAuthState = atom<UserAuthState | undefined>({
  key: "userAuth",
  default: {
    initialized: false,
  },
  dangerouslyAllowMutability: true,
});
