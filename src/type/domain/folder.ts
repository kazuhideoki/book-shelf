import { File } from "./file";

export type Folder = {
  id: string;
  name: string;
  open: boolean;
  meta: {
    nextPageToken: string;
    incompleteSearch: string;
  };
  item: {
    folders: Folder[];
    files: File[];
  };
};
