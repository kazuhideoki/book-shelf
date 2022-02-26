import { Box, CircularProgress } from "@mui/material";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { RecoilRoot, useRecoilState, useRecoilValue } from "recoil";
import { SignIn } from "../components/Signin";
import { CustomSnackbar } from "../components/Snackbar";
import { driveAuthState } from "../recoil/atom/drive-auth";
import { loadingState } from "../recoil/atom/loading";
import { userAuthState } from "../recoil/atom/user-auth";
import { useRequest } from "../utils/axios";
import { useWithLoading } from "../utils/with-loading";

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
  const withLoading = useWithLoading();

  const [userAuth, setAuthState] = useRecoilState(userAuthState);
  const [driveAuth, setDriveAuth] = useRecoilState(driveAuthState);

  // useEffect(() => {
  //   if (userAuth?.initialized) {
  //     const userId = userAuth.userAuth?.uid;
  //     withLoading(
  //       request<AppUser>("GET", ServerPath.user(userId!), {
  //         headers: {
  //           userAuth: JSON.stringify(userAuth.userAuth) as any,
  //           userId,
  //         },
  //       })
  //         .then((appUser) => {
  //           if (appUser?.driveAuth) {
  //             setDriveAuth({ driveAuth: appUser.driveAuth, initialized: true });
  //           }
  //         })
  //         .catch((e) => console.log(`Error occurred appUser: ${e} `))
  //     );
  //   }
  // }, [userAuth?.initialized]);

  // useEffect(() => {
  //   return FrontFirebaseHelper.listenFirebaseAuth(async (user) => {
  //     setAuthState({ userAuth: user, initialized: true });

  //     if (user && !code) {
  //     }

  //     if (user && code) {
  //       const res = await withLoading(
  //         axiosRequest<DriveAuth>("GET", ServerPath.driveToken, {
  //           params: {
  //             code,
  //             userAuth: user,
  //             userId: user.uid,
  //           },
  //           headers: {
  //             userAuth: JSON.stringify(user) as any,
  //             userId: user.uid,
  //           },
  //         })
  //       );

  //       setDriveAuth({ driveAuth: res, initialized: true });
  //     }
  //   });
  // }, [code]);

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

  if (!userAuth?.initialized || !driveAuth?.initialized) {
    return <SignIn />;
  }

  return (
    <>
      <Component {...pageProps} />
      <CustomSnackbar />
    </>
  );
}
