import { User } from "@firebase/auth";
import { atom } from "recoil";

export const userAuthState = atom<User | null>({
  key: "userAuth",
  default: null,
});
