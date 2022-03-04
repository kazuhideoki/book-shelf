import { atom } from "recoil";
import { UserAuth } from "../../type/model/firestore-user.type";

export type UserAuthState = { userAuth?: UserAuth; initialized: boolean };

export const userAuthState = atom<UserAuthState | undefined>({
  key: "userAuth",
  default: {
    initialized: false,
  },
  dangerouslyAllowMutability: true,
});
