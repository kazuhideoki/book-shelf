import { atom, selector } from "recoil";
import { ServerPath } from "../../server/helper/const";
import { DisplaySet } from "../../type/model/firestore-display-set.type";
import { axiosRequestToServer } from "../../utils/axios";
import { authState } from "./auth";
import { guardRecoilDefaultValue } from "./helper/guard-recoil-default-value";

export type DisplaySetsState = {
  displaySets: DisplaySet[];
  selected?: DisplaySet;
  initilized: boolean;
};

export const displaySetsAtom = atom<DisplaySetsState>({
  key: "displaySets",
  default: { displaySets: [], initilized: false },
});

export const displaySets = selector<DisplaySet[]>({
  key: "displaySetsFetch",
  get: async ({ get }) => {
    const displaySetsState = get(displaySetsAtom);
    if (displaySetsState.initilized) {
      return displaySetsState.displaySets;
    }

    const { auth } = get(authState);
    const request = axiosRequestToServer(auth);
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

    set(displaySetsAtom, { displaySets: newValue, initilized: true });
  },
});
