import { User } from "@firebase/auth";
import { atom } from "recoil";

export const userAuthState = atom<Partial<User> | undefined>({
  key: "userAuth",
  default: undefined,
  dangerouslyAllowMutability: true,
});
