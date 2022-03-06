import { atom } from "recoil";

export type SelectedFiles = {
  fileId: string;
  index: number;
}[];

export const selectedFilesAtom = atom<SelectedFiles>({
  key: "selectedFiles",
  default: [],
});
