import { IFile } from "./file";

export type IFolder = {
  id: string;
  name: string;
  open: boolean;
  meta?: {
    nextPageToken: string;
    incompleteSearch: boolean;
  };
  item?: {
    folders?: IFolder[];
    files?: IFile[];
  };
};
