import { Button } from "@mui/material";
import {
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";
import { NextComponentType, NextPageContext } from "next";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import GoogleLogin, { GoogleLoginResponse } from "react-google-login";
import { useRecoilState } from "recoil";
import { authState } from "../recoil/atom/auth";
import { Account } from "../type/model/account";
import { axiosRequest } from "../utils/axios";
import { FrontAuth } from "../utils/front-firebase";

export const SignIn: NextComponentType<
  NextPageContext,
  Record<string, unknown>,
  Record<string, never>
> = () => {
  const router = useRouter();
  const [renderAuth, setRenderAuth] = useState(false);
  const [auth, setAuth] = useRecoilState(authState);
  useEffect(() => setRenderAuth(typeof window !== "undefined"), []);

  const handleSignin = async () => {
    const credential: UserCredential = await signInWithPopup(
      FrontAuth,
      new GoogleAuthProvider()
    );
  };

  const handleDriveAuth = async () => {
    const url = await axiosRequest<string>("GET", `/api/drive/auth`);

    Router.push(url);
  };

  const handleGoogleAuth = async (googleData: GoogleLoginResponse) => {
    console.log({ googleData });

    const res = await axiosRequest<Account>("POST", `/api/auth`, {
      headers: {
        Authorization: `Bearer ${googleData?.tokenId}`,
      },
    });

    console.log({ res });

    // TODO ここの返り値で
    // - global state auth（user） に格納

    setAuth({
      auth: { ...res, accessToken: googleData.accessToken },
      initialized: true,
    });

    //   - （結果）Topへ飛ばす

    // - serverSideでは ユーザー情報を保存

    // 検証
    // - 時間が立ったときにアクセスできるかどうか？

    console.log({ res });
  };

  return (
    <div>
      <p>E Book Shelf</p>
      {renderAuth && <Button onClick={handleSignin}>サインイン</Button>}
      {renderAuth && (
        <Button onClick={handleDriveAuth}>Google Drive認証</Button>
      )}
      <GoogleLogin
        clientId={process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_CLIENT_ID!}
        isSignedIn={true}
        buttonText="Login"
        onSuccess={(res) => handleGoogleAuth(res as GoogleLoginResponse)}
        onFailure={(failure) => console.log({ failure })}
        // scope={
        //   "https://www.googleapis.com/auth/drive,https://www.googleapis.com/auth/firebase"
        // }
        scope={"https://www.googleapis.com/auth/drive"}
        cookiePolicy={"single_host_origin"}
      />
    </div>
  );
};
