import { Box, CircularProgress } from "@mui/material";
import { AppProps } from "next/app";
import { RecoilRoot, useRecoilValue } from "recoil";
import { SignIn } from "../components/Signin";
import { CustomSnackbar } from "../components/Snackbar";
import { authState } from "../recoil/atom/auth";
import { loadingState } from "../recoil/atom/loading";

interface P {}

export default function App(props: AppProps) {
  return (
    <RecoilRoot>
      <_App {...props} />
    </RecoilRoot>
  );
}

function _App({ Component, pageProps }: AppProps<P>) {
  const loading = useRecoilValue(loadingState);
  const auth = useRecoilValue(authState);

  if (loading) {
    return (
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "rgba(255,255,255,0.5)",
        }}
      >
        <CircularProgress size={96} />
      </Box>
    );
  }

  if (!auth.initialized) {
    return <SignIn />;
  }

  return (
    <>
      <Component {...pageProps} />
      <CustomSnackbar />
    </>
  );
}
