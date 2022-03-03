import { selector } from "recoil";
import { ServerPath } from "../../server/helper/const";
import { ImageSet } from "../../type/model/firestore-image-set.type";
import { axiosRequestToServer } from "../../utils/axios";
import { authState } from "../atom/auth";
import { displaySetsAtom } from "../atom/display-set";
import { guardRecoilDefaultValue } from "../atom/helper/guard-recoil-default-value";
import { imageSetsAtom } from "../atom/image-set";

export const fetchImageSets = selector<ImageSet[]>({
  key: "imageSetsFetch",
  get: async ({ get }) => {
    const imageSetsState = get(imageSetsAtom);
    if (imageSetsState.initilized) {
      return imageSetsState.imageSets;
    }

    const selectedDisplaySets = get(displaySetsAtom).selected;

    if (!selectedDisplaySets) {
      throw "Display set must be set";
    }

    const { auth } = get(authState);
    const request = axiosRequestToServer(auth);
    console.log(`init imageSetsState`);

    try {
      const res = await Promise.all(
        selectedDisplaySets?.files.map((e) =>
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

    set(imageSetsAtom, { imageSets: newValue, initilized: true });
  },
});
