import { atom } from "recoil";
import { Folder } from "../../type/domain/folder";

export type DirectoryState = Folder & {
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
