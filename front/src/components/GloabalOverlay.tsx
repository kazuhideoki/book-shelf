import { Box, CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { NextComponentType } from "next";
import { useRecoilValue } from "recoil";
import { loadingState } from "../recoil/atom/loading";
import { CustomSnackbar } from "./CustomSnackbar";

const useStyles = makeStyles(() => ({
  root: {
    display: "fixed",
    zIndex: 2000,
  },
  circular: {
    transition: "opacity ease-in-out 0.2s",
    opacity: 0,
  },
  circularShow: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    opacity: 1,
    backgroundColor: "rgba($bg-gray, 0.4)",
    backdropFilter: "blur(1px)",
    left: 0,
    top: 0,
    position: "fixed",
    width: "100vw",
    height: "100vh",
  },
}));

export const GlobalOverlay: NextComponentType = () => {
  const classes = useStyles();
  const loading = useRecoilValue(loadingState);

  return (
    <Box className={classes.root}>
      {loading && (
        <Box
          className={`${classes.circular} ${loading && classes.circularShow}`}
        >
          <CircularProgress size={96} />
        </Box>
      )}
      <CustomSnackbar />
    </Box>
  );
};
