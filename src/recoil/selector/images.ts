import { selector } from "recoil";
import { ServerPath } from "../../server/helper/const";
import { ImageSet } from "../../type/model/firestore-image-set.type";
import { axiosRequestToServer } from "../../utils/axios";
import { authState } from "../atom/auth";

export const imageSetsAsync = selector<ImageSet[]>({
  key: "displaySetsFetch",
  get: async ({ get }) => {
    const { auth } = get(authState);
    const request = axiosRequestToServer(auth);

    try {
      const res = await request<ImageSet[]>("GET", ServerPath.files);
      console.log({ imageSets: res });

      console.log("fetched imageSets");

      return res;
    } catch (error) {
      console.log("errro fetching imageSets");
      console.log({ error });

      throw error;
    }
  },
});
