import { atom, selector } from "recoil";
import { ServerPath } from "../../server/helper/const";
import { ImageSet } from "../../type/model/firestore-image-set.type";
import { axiosRequestToServer } from "../../utils/axios";
import { authState } from "./auth";
import { guardRecoilDefaultValue } from "./helper/guard-recoil-default-value";

export type ImageSetsState = {
  imageSets: ImageSet[];
  initilized: boolean;
};

export const imageSetsAtom = atom<ImageSetsState>({
  key: "imageSets",
  default: { imageSets: [], initilized: false },
});

export const imageSets = selector<ImageSet[]>({
  key: "imageSetsFetch",
  get: async ({ get }) => {
    const imageSetsState = get(imageSetsAtom);
    if (imageSetsState.initilized) {
      return imageSetsState.imageSets;
    }

    const { auth } = get(authState);
    const request = axiosRequestToServer(auth);
    console.log(`init imageSetsState`);

    try {
      const res = await request<ImageSet[]>("GET", ServerPath.files);
      console.log(`done fetched imageSets`);

      return res;
    } catch (error) {
      console.log(`error occurred when fetching imageSets`);
      console.log({ error });

      throw error;
    }
  },
  set: ({ set }, newValue) => {
    if (guardRecoilDefaultValue(newValue)) return;

    set(imageSetsAtom, { imageSets: newValue, initilized: true });
  },
});
