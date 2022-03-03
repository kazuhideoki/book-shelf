import { Box, Grid, Typography } from "@mui/material";
import { NextComponentType, NextPageContext } from "next";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { fetchImageSets } from "../recoil/selector/image-set";
import { ImageSet } from "../type/model/firestore-image-set.type";

interface P {}
export const Display: NextComponentType<
  NextPageContext,
  Record<string, unknown>,
  P
> = ({}) => {
  const imageSets = useRecoilValue(fetchImageSets);

  const [targetImg, setTargetImg] = useState<ImageSet | null>(null);

  // 表示する画像を一定間隔で入れ替える
  useEffect(() => {
    let count = 1;
    const timer = setInterval(() => {
      if (imageSets.length) {
        const fileNumber = count % imageSets.length;

        setTargetImg(imageSets[fileNumber]);

        count++;
      }
    }, 6000);

    return () => clearInterval(timer);
  }, [imageSets, imageSets.length]);

  return (
    <Box>
      <Grid item container justifyContent="center" direction="column">
        <Grid item>
          <img
            src={targetImg?.path}
            style={{ maxWidth: 400, maxHeight: 400 }}
          />
        </Grid>
        <Grid item>
          <Typography>{targetImg?.meta.title}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};
