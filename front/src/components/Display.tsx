import { Box, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { NextComponentType, NextPageContext } from "next";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { ImageSet } from "../../../server/src/type/model/firestore-image-set.type";
import { ImageSetsSelector } from "../recoil/selector/image-set";

const useStyles = makeStyles(() => ({
  root: {
    // width: "100vw",
    // height: "100vh",
  },
  img: {},
}));

interface P {}
export const Display: NextComponentType<
  NextPageContext,
  Record<string, unknown>,
  P
> = ({}) => {
  const classes = useStyles();
  const imageSets = useRecoilValue(ImageSetsSelector);

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
    <Box className={classes.root}>
      <Grid item container justifyContent="center" direction="column">
        <Grid item>
          <img
            src={targetImg?.path}
            style={{ maxWidth: "95vw", maxHeight: "95vh" }}
          />
        </Grid>
        <Grid item>
          <Typography>{targetImg?.meta.title}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};
