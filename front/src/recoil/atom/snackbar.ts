import { atom } from "recoil";

export type SnackbarState = {
  open: boolean;
  message: string;
};

export const snackbarState = atom<SnackbarState>({
  key: "snackbarState",
  default: { open: false, message: "" },
});
