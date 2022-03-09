import { selector } from "recoil";
import { DisplaySet } from "../../type/model/firestore-display-set.type";
import { ServerPath } from "../../utils/const";
import { displaySetsState } from "../atom/display-set";
import { guardRecoilDefaultValue } from "../atom/helper/guard-recoil-default-value";
import { requestSelector } from "./helper/request";

export const displaySetsSelector = selector<DisplaySet[]>({
  key: "displaySetsSelector",
  get: async ({ get }) => {
    const { displaySets, initilized } = get(displaySetsState);
    if (initilized) {
      return displaySets;
    }

    const request = get(requestSelector);
    console.log(`init displaySetsState`);

    try {
      const res = await request<DisplaySet[]>("GET", ServerPath.displaySets);
      console.log(`done fetched displaySets`);

      return res;
    } catch (error) {
      console.log(`error occurred when fetching displaySets`);
      console.log({ error });

      throw error;
    }
  },
  set: ({ set }, newValue) => {
    if (guardRecoilDefaultValue(newValue)) return;

    set(displaySetsState, { displaySets: newValue, initilized: true });
  },
});