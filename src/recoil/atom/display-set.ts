import { atom } from "recoil";
import { DisplaySet } from "../../type/model/firestore-display-set.type";

export type DisplaySetsState = {
  displaySets: DisplaySet[];
  selected?: DisplaySet;
  initilized: boolean;
};

// 読み込んだ displaySet
export const displaySetsAtom = atom<DisplaySetsState>({
  key: "displaySets",
  default: { displaySets: [], initilized: false },
});
