import { Box, CircularProgress } from "@mui/material";
import { GetServerSideProps } from "next";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { RecoilRoot, useRecoilState, useRecoilValue } from "recoil";
import { SignIn } from "../components/Signin";
import { DriveAuth, driveAuthState } from "../recoil/atom/drive-auth";
import { loadingState } from "../recoil/atom/loading";
import { userAuthState } from "../recoil/atom/user-auth";
import { ServerPath } from "../server/helper/const";
import { AppUser } from "../type/model/firestore-user.type";
import { axiosRequest, useRequest } from "../utils/axios";
import { FrontFirebaseHelper } from "../utils/front-firebase";

interface P {
  code?: string;
  auth?: DriveAuth;
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
  const auth = Component.defaultProps?.auth;

  console.log({ code, auth });

  const router = useRouter();
  const request = useRequest();
  const loading = useRecoilValue(loadingState);

  const [userAuth, setAuthState] = useRecoilState(userAuthState);
  const [driveAuth, setDriveAuth] = useRecoilState(driveAuthState);

  // const handleDriveAuth = async() => {
  //   axiosRequest<void>("GET", ServerPath.driveToken, {
  //     params: {
  //       code,
  //       userAuth: user,
  //       userId: user.uid,
  //     },
  //     headers: { userAuth: JSON.stringify(user) as any, userId: user.uid },
  //   }).catch((e) => console.log(`error occurred in getToken: ${e}`));
  // }

  useEffect(() => {
    if (auth) setDriveAuth({ driveAuth: auth, initialized: true });
  }, []);

  useEffect(() => {
    return FrontFirebaseHelper.listenFirebaseAuth(async (user) => {
      setAuthState({ userAuth: user, initialized: true });

      console.log(`user && code前`);
      console.log({ userAuth: user, userId: user.uid });

      if (user && !code) {
        console.log(`user && ！code`);

        const appUser = await axiosRequest<AppUser>(
          "GET",
          ServerPath.user(user.uid),
          {
            headers: {
              userAuth: JSON.stringify(user) as any,
              userId: user.uid,
            },
          }
        );
        // .catch(e => {
        //   if(e instanceof HttpsError && e.customErrorCode === CustomErrorCode.APP_USER_NOT_REGISTERED){

        //   }
        // });

        if (appUser.driveAuth) {
          setDriveAuth({ driveAuth: appUser.driveAuth, initialized: true });
        }
      }

      if (user && code) {
        console.log(`user && code`);

        const res = await axiosRequest<DriveAuth>(
          "GET",
          ServerPath.driveToken,
          {
            params: {
              code,
              userAuth: user,
              userId: user.uid,
            },
            headers: {
              userAuth: JSON.stringify(user) as any,
              userId: user.uid,
            },
          }
        );

        setDriveAuth({ driveAuth: res, initialized: true });
      }
    });
  }, [code]);

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
  const auth = context.query.driveAuth
    ? (JSON.parse(context.query.driveAuth as string) as DriveAuth)
    : undefined;
  const code = context.query.code as string;

  console.log("getServerSideProps");
  console.log({ code, auth });

  return { props: { code, auth } };
};
