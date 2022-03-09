import { DisplaySet } from "../model/firestore-display-set.type";

export type RegisterDispalySet = Pick<DisplaySet, "name"> & {
  files: DisplaySet["files"];
};
