import { User } from "@firebase/auth";
import { atom } from "recoil";

export const authState = atom<User | null>({
  key: "auth",
  default: null,
});
