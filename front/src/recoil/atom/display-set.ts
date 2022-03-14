import { atom } from "recoil";
import { DisplaySet } from "../../../../server/src/2-resources/controllers/display-sets/entities/display-set.entity";

export type DisplaySetsState = {
  displaySets: DisplaySet[];
  selected?: DisplaySet;
  initilized: boolean;
};

// 読み込んだ displaySet
export const displaySetsState = atom<DisplaySetsState>({
  key: "displaySetsState",
  default: { displaySets: [], initilized: false },
});
