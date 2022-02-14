import { AppProps } from "next/app";
import { useEffect } from "react";
import { RecoilRoot, useRecoilValue, useSetRecoilState } from "recoil";
import { SignIn } from "../components/Signin";
import { userAuthState } from "../recoil/atom/user-auth";
import { FrontFirebaseHelper } from "../utils/front-firebase";

export default function App(props: AppProps) {
  return (
    <RecoilRoot>
      <_App {...props} />;
    </RecoilRoot>
  );
}

function _App({ Component, pageProps }: AppProps) {
  const auth = useRecoilValue(userAuthState);
  const setAuthState = useSetRecoilState(userAuthState);

  useEffect(() => {
    return FrontFirebaseHelper.listenFirebaseAuth(
      // (user) => setAuthState({ ...user })
      (user) => console.log({ user })
    );
  }, [auth, setAuthState]);

  if (!auth) {
    return <SignIn />;
  }

  return (
    <>
      <Component {...pageProps} />
    </>
  );
}
