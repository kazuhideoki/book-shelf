import { atom } from "recoil";

export type SelectedFiles = {
  fileId: string;
  index: number;
}[];

// /settings で選択したファイル
export const selectedFilesState = atom<SelectedFiles>({
  key: "selectedFilesState",
  default: [],
});
