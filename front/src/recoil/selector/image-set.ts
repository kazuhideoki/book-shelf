import { selector } from "recoil";
import { ImageSet } from "../../type/model/firestore-image-set.type";
import { ServerPath } from "../../utils/const";
import { displaySetsState } from "../atom/display-set";
import { guardRecoilDefaultValue } from "../atom/helper/guard-recoil-default-value";
import { imageSetsState } from "../atom/image-set";
import { requestSelector } from "./helper/request";

export const ImageSetsSelector = selector<ImageSet[]>({
  key: "ImageSetsSelector",
  get: async ({ get }) => {
    const { imageSets, initilized } = get(imageSetsState);
    if (initilized) {
      return imageSets;
    }

    const displaySet = get(displaySetsState).selected;

    if (!displaySet) {
      return [];
    }

    const request = get(requestSelector);
    console.log(`init imageSetsState`);

    try {
      const res = await Promise.all(
        displaySet?.files.map((e) =>
          request<ImageSet>("GET", ServerPath.file(e.fileId))
        )
      );
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

    set(imageSetsState, { imageSets: newValue, initilized: true });
  },
});
