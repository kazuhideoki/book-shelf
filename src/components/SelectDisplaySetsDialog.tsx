import { Box, Button, MenuItem } from "@mui/material";
import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { displaySetsAtom } from "../recoil/atom/display-set";
import { fetchDisplaySets } from "../recoil/selector/display-set";
import { FrontPath } from "../server/helper/const";
import { useRequest } from "../utils/axios";
import { useWithLoading } from "../utils/with-loading";
interface P {
  setShowDialog: Dispatch<SetStateAction<boolean>>;
}

export const SelectDisplaySetsDialog: NextComponentType<
  NextPageContext,
  Record<string, unknown>,
  P
> = ({ setShowDialog }) => {
  console.log("SelectDisplaySetsDialog");

  const displaySets = useRecoilValue(fetchDisplaySets);
  const setDisplaySets = useSetRecoilState(displaySetsAtom);
  const router = useRouter();
  const request = useRequest();
  const withLoading = useWithLoading();

  return (
    <>
      {displaySets.map((displaySet, i) => {
        return (
          <MenuItem
            key={i}
            value={displaySet.displaySetId}
            onClick={async (e) => {
              // const res = Promise.all([
              //   ...displaySet.files.map((e) =>
              //     withLoading(
              //       request<ImageSet>("GET", ServerPath.file(e.fileId))
              //     )
              //   ),
              // ]);

              setDisplaySets((prev) => ({ ...prev, selected: displaySet }));

              setShowDialog(false);
            }}
          >
            {" "}
            {displaySet.name}
          </MenuItem>
        );
      })}
      <Box mt={2} />
      <Button onClick={() => router.push(FrontPath.settings)}>設定する</Button>
    </>
  );
};
