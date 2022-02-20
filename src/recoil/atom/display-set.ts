import { atom } from "recoil";
import { DisplaySet } from "../../type/model/firestore-display-set.type";

export const displaySetsState = atom<DisplaySet[]>({
  key: "displaySets",
  default: [],
});
