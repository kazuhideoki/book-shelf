import { atom } from "recoil";

export type SelectedFiles = {
  fileId: string;
  index: number;
}[];

// /settings で選択したファイル
export const selectedFilesAtom = atom<SelectedFiles>({
  key: "selectedFiles",
  default: [],
});
