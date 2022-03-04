import { selector } from "recoil";
import { directoryStateAtom } from "../atom/directory";

export const listItem = selector({
  key: "listItem",
  get: ({ get }) => {
    const { item } = get(directoryStateAtom);

    return [...item.folders, ...item.files];
  },
});
