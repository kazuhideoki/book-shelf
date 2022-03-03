import { AppProps } from "next/app";
import { useEffect } from "react";
import { RecoilRoot, useRecoilValue } from "recoil";
import { GlobalOverlay } from "../components/GloabalOverlay";
import { SignIn } from "../components/Signin";
import { authSignedIn } from "../recoil/selector/auth";

export default function App(props: AppProps) {
  return (
    <RecoilRoot>
      <_App {...props} />
    </RecoilRoot>
  );
}

function _App({ Component, pageProps }: AppProps) {
  const signedIn = useRecoilValue(authSignedIn);

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles?.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      {signedIn ? <Component {...pageProps} /> : <SignIn />}
      <GlobalOverlay />
    </>
  );
}
