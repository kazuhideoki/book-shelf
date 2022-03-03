import { Box, Button, MenuItem } from "@mui/material";
import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import { FrontPath, ServerPath } from "../server/helper/const";
import { DisplaySet } from "../type/model/firestore-display-set.type";
import { ImageSet } from "../type/model/firestore-image-set.type";
import { useRequest } from "../utils/axios";
import { useWithLoading } from "../utils/with-loading";
interface P {
  onSetImg: Dispatch<SetStateAction<Promise<ImageSet[]>>>;
  setShowDialog: Dispatch<SetStateAction<boolean>>;
}

export const SelectDisplaySetsDialog: NextComponentType<
  NextPageContext,
  Record<string, unknown>,
  P
> = ({ onSetImg, setShowDialog }) => {
  console.log("SelectDisplaySetsDialog");

  // const displaySets = useRecoilValue(displaySetsState);
  const displaySets: DisplaySet[] = [];
  const router = useRouter();
  const request = useRequest();
  const withLoading = useWithLoading();

  return (
    <>
      {displaySets.map((displaySet, i) => {
        return (
          <>
            <MenuItem
              key={i}
              value={displaySet.displaySetId}
              onClick={async (e) => {
                const res = Promise.all([
                  ...displaySet.files.map((e) =>
                    withLoading(
                      request<ImageSet>("GET", ServerPath.file(e.fileId))
                    )
                  ),
                ]);

                onSetImg(res);
                setShowDialog(false);
              }}
            >
              {" "}
              {displaySet.name}
            </MenuItem>
          </>
        );
      })}
      <Box mt={2} />
      <Button onClick={() => router.push(FrontPath.settings)}>設定する</Button>
    </>
  );
};
