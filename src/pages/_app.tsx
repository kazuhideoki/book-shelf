import { AppProps } from "next/app";
import { useEffect } from "react";
import { RecoilRoot, useRecoilValue, useSetRecoilState } from "recoil";
import { SignIn } from "../components/Signin";
import { authState } from "../recoil/atom/auth";
import { FrontFirebaseHelper } from "../utils/front-firebase";

export default function App(props: AppProps) {
  return (
    <RecoilRoot>
      <_App {...props} />;
    </RecoilRoot>
  );
}

function _App({ Component, pageProps }: AppProps) {
  const setAuthState = useSetRecoilState(authState);
  useEffect(() => {
    // FrontAuth.
    return FrontFirebaseHelper.listenFirebaseAuth((credential) =>
      setAuthState(credential)
    );
  }, []);

  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  const auth = useRecoilValue(authState);

  if (!auth) {
    return <SignIn />;
  }

  return (
    <>
      <Component {...pageProps} />
    </>
  );
}
