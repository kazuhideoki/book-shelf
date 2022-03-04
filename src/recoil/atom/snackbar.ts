import { atom } from "recoil";

export type SnackbarState = {
  open: boolean;
  message: string;
};

export const snackbarState = atom<SnackbarState>({
  key: "snackBar",
  default: { open: false, message: "" },
});
