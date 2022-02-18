import { Box, CircularProgress } from "@material-ui/core";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { RecoilRoot, useRecoilState, useRecoilValue } from "recoil";
import { SignIn } from "../components/Signin";
import { driveAuthState } from "../recoil/atom/drive-auth";
import { loadingState } from "../recoil/atom/loading";
import { userAuthState } from "../recoil/atom/user-auth";
import { FrontFirebaseHelper } from "../utils/front-firebase";

interface P {
  code?: string;
}

export default function App(props: AppProps) {
  return (
    <RecoilRoot>
      <_App {...props} />;
    </RecoilRoot>
  );
}

function _App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const loading = useRecoilValue(loadingState);
  const [userAuth, setAuthState] = useRecoilState(userAuthState);
  const driveAuth = useRecoilValue(driveAuthState);

  useEffect(() => {
    return FrontFirebaseHelper.listenFirebaseAuth((user) => {
      console.log("front!!!!!!!!!!");
      setAuthState(user);
    });
  }, []);

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

  if (!userAuth || !driveAuth) {
    return <SignIn />;
  }

  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const code = context.query?.code as string;

//   if (!code) {
//     const url = getAuthUrl();
//     context.res.setHeader("location", url);
//     context.res.statusCode = 302;
//     context.res.end();
//     return { props: {} };
//   }

//   return { props: { code } };
// };
