import { selector } from "recoil";
import { authState } from "../atom/auth";

export const authSignedIn = selector({
  key: "authSignedIn",
  get: ({ get }) => {
    const { auth, initialized } = get(authState);
    return auth?.tokenId != null && initialized;
  },
});
