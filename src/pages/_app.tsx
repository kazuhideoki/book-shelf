import { Box, CircularProgress } from "@mui/material";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { RecoilRoot, useRecoilState, useRecoilValue } from "recoil";
import { SignIn } from "../components/Signin";
import { driveAuthState } from "../recoil/atom/drive-auth";
import { loadingState } from "../recoil/atom/loading";
import { userAuthState } from "../recoil/atom/user-auth";
import { ServerPath } from "../server/helper/const";
import { AppUser } from "../type/model/firestore-user.type";
import { DriveAuth } from "../type/model/google-drive-auth.type";
import { axiosRequest, useRequest } from "../utils/axios";
import { FrontFirebaseHelper } from "../utils/front-firebase";

interface P {}

export default function App(props: AppProps) {
  return (
    <RecoilRoot>
      <_App {...props} />
    </RecoilRoot>
  );
}

function _App({ Component, pageProps }: AppProps<P>) {
  const router = useRouter();
  const code = router.query.code;

  const request = useRequest();
  const loading = useRecoilValue(loadingState);

  const [userAuth, setAuthState] = useRecoilState(userAuthState);
  const [driveAuth, setDriveAuth] = useRecoilState(driveAuthState);

  console.log(`topで`);

  console.log({ userAuth, driveAuth });

  useEffect(() => {
    if (userAuth?.initialized) {
      const userId = userAuth.userAuth?.uid;
      request<AppUser>("GET", ServerPath.user(userId!), {
        headers: {
          userAuth: JSON.stringify(userAuth.userAuth) as any,
          userId,
        },
      })
        .then((appUser) => {
          console.log({ appUser });

          if (appUser?.driveAuth) {
            setDriveAuth({ driveAuth: appUser.driveAuth, initialized: true });
          }
        })
        .catch((e) => console.log(`Error occurred appUser: ${e} `));
    }
  }, [userAuth?.initialized]);

  useEffect(() => {
    return FrontFirebaseHelper.listenFirebaseAuth(async (user) => {
      setAuthState({ userAuth: user, initialized: true });

      console.log(`user && code前`);
      console.log({ userAuth: user, userId: user.uid, code });

      if (user && !code) {
        console.log(`user && ！code`);

        // const appUser = await axiosRequest<AppUser>(
        //   "GET",
        //   ServerPath.user(user.uid),
        //   {
        //     headers: {
        //       userAuth: JSON.stringify(user) as any,
        //       userId: user.uid,
        //     },
        //   }
        // ).catch((e) => console.log(`Error occurred appUser: ${e} `));

        // console.log({ appUser });

        // if (appUser?.driveAuth) {
        //   setDriveAuth({ driveAuth: appUser.driveAuth, initialized: true });
        // }
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
