import { Box, CircularProgress } from "@mui/material";
import { GetServerSideProps } from "next";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { RecoilRoot, useRecoilState, useRecoilValue } from "recoil";
import { SignIn } from "../components/Signin";
import { driveAuthState } from "../recoil/atom/drive-auth";
import { loadingState } from "../recoil/atom/loading";
import { userAuthState } from "../recoil/atom/user-auth";
import { ServerPath } from "../server/helper/const";
import { GetAccessToken as GetDriveToken } from "../type/api/google-drive-api.type";
import { useRequest } from "../utils/axios";
import { FrontFirebaseHelper } from "../utils/front-firebase";

interface P {
  code?: string;
}

export default function App(props: AppProps) {
  return (
    <RecoilRoot>
      <_App {...props} />
    </RecoilRoot>
  );
}

function _App({ Component, pageProps }: AppProps<P>) {
  const code = Component.defaultProps?.code;
  const router = useRouter();
  const request = useRequest();
  const loading = useRecoilValue(loadingState);

  const [userAuth, setAuthState] = useRecoilState(userAuthState);
  const [driveAuth, setDriveAuth] = useRecoilState(driveAuthState);

  useEffect(() => {
    return FrontFirebaseHelper.listenFirebaseAuth(async (user) => {
      setAuthState({ userAuth: user, initialized: true });

      console.log(`user && code前`);
      console.log({ userAuth: user, userId: user.uid });

      if (user && code) {
        console.log(`user && code2`);

        request<void, GetDriveToken>("GET", ServerPath.driveToken, {
          params: {
            code,
            userAuth: user,
            userId: user.uid,
          },
          headers: { userAuth: user, userId: user.uid },
        }).catch((e) => console.log(`error occurred in getToken: ${e}`));
      }
    });
  }, [code, request]);

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
        }}
      >
        <CircularProgress size={96} />
      </Box>
    );
  }

  if (!userAuth?.initialized || !driveAuth?.initialized) {
    return <SignIn />;
  }

  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // const auth = JSON.parse(context.query.driveAuth as string);
  const code = context.query.code as string;

  return { props: { code } };
};
