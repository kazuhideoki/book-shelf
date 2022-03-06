import { atom } from "recoil";
import { IFolder } from "../../type/domain/folder";

export type DirectoryState = IFolder & {
  initilized: boolean;
};

export const directoryStateAtom = atom<DirectoryState>({
  key: "directory",
  default: {
    id: "",
    name: "root",
    open: false,
    meta: {
      nextPageToken: "",
      incompleteSearch: "",
    },
    item: {
      folders: [],
      files: [],
    },
    initilized: false,
  },
});
