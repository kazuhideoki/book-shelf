import { User } from "@firebase/auth";
import { atom } from "recoil";

export const userAuthState = atom<Partial<User>>({
  key: "userAuth",
  default: {},
});
