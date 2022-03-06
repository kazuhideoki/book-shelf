import { Box, Button, MenuItem } from "@mui/material";
import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { displaySetsAtom } from "../recoil/atom/display-set";
import { fetchDisplaySets } from "../recoil/selector/display-set";
import { FrontPath } from "../server/helper/const";
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

  return (
    <>
      {displaySets.map((displaySet, i) => {
        return (
          <MenuItem
            key={i}
            value={displaySet.displaySetId}
            onClick={async (e) => {
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
