import { Box, Grid, Typography } from "@mui/material";
import { NextComponentType, NextPageContext } from "next";
import { ImageSet } from "../type/model/firestore-image-set.type";

interface P {
  imageSet: ImageSet;
}
export const Display: NextComponentType<
  NextPageContext,
  Record<string, unknown>,
  P
> = ({ imageSet }) => {
  return (
    <Box>
      <Grid item container justifyContent="center" direction="column">
        <Grid item>
          <img src={imageSet?.path} style={{ maxWidth: 400, maxHeight: 400 }} />
        </Grid>
        <Grid item>
          <Typography>{imageSet?.meta.title}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};
