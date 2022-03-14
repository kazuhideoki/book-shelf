import { atom } from "recoil";
import { ImageSet } from "../../../../server/src/type/model/image-set.entiry";

export type ImageSetsState = {
  imageSets: ImageSet[];
  initilized: boolean;
};

// 読み込んだイメージセット
export const imageSetsState = atom<ImageSetsState>({
  key: "imageSetsState",
  default: { imageSets: [], initilized: false },
});
