import { atom } from "recoil";
import { ImageSet } from "../../type/model/firestore-image-set.type";

export type ImageSetsState = {
  imageSets: ImageSet[];
  initilized: boolean;
};

export const imageSetsAtom = atom<ImageSetsState>({
  key: "imageSets",
  default: { imageSets: [], initilized: false },
});
