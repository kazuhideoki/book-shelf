import { atom } from "recoil";
import { IFile } from "../../type/domain/file";

export type SelectedFiles = {
  file: IFile;
  index: number;
}[];

export const selectedFilesAtom = atom<SelectedFiles>({
  key: "selectedFiles",
  default: [],
});
