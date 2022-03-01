import { AppProps } from "next/app";
import { RecoilRoot, useRecoilValue } from "recoil";
import { GlobalOverlay } from "../components/GloabalOverlay";
import { SignIn } from "../components/Signin";
import { authState } from "../recoil/atom/auth";

interface P {}

export default function App(props: AppProps) {
  return (
    <RecoilRoot>
      <_App {...props} />
    </RecoilRoot>
  );
}

function _App({ Component, pageProps }: AppProps<P>) {
  const auth = useRecoilValue(authState);

  return (
    <>
      {auth.initialized ? <Component {...pageProps} /> : <SignIn />}
      <GlobalOverlay />
    </>
  );
}
