import { selector } from "recoil";
import { axiosRequestToServer } from "../../../utils/axios";
import { authState } from "../../atom/auth";

export const requestSelector = selector({
  key: "requestSelector",
  get: ({ get }) => {
    const { auth } = get(authState);
    return axiosRequestToServer(auth);
  },
});
