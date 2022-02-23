import { Button } from "@mui/material";
import {
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";
import { NextComponentType, NextPageContext } from "next";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { DriveAuth, driveAuthState } from "../recoil/atom/drive-auth";
import { axiosRequest } from "../utils/axios";
import { FrontAuth } from "../utils/front-firebase";

export const SignIn: NextComponentType<
  NextPageContext,
  Record<string, unknown>,
  Record<string, never>
> = () => {
  const router = useRouter();
  const [renderAuth, setRenderAuth] = useState(false);
  useEffect(() => setRenderAuth(typeof window !== "undefined"), []);

  const setDriveAuth = useSetRecoilState(driveAuthState);

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

  const code = router.query.code;

  useEffect(() => {
    if (code) {
      axiosRequest<DriveAuth>("GET", `/api/drive/token`, {
        params: { code },
      }).then((res) => setDriveAuth({ driveAuth: res, initialized: true }));
    }
  }, [code]);

  return (
    <div>
      <p>E Book Shelf</p>
      {renderAuth && (
        <Button onClick={handleDriveAuth}>Google Drive認証</Button>
      )}
    </div>
  );
};
