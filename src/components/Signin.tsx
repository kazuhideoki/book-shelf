import { Button } from "@material-ui/core";
import {
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";
import { NextComponentType, NextPageContext } from "next";
import { useEffect, useState } from "react";
import { FrontAuth } from "../utils/front-firebase";

export const SignIn: NextComponentType<
  NextPageContext,
  Record<string, unknown>,
  Record<string, never>
> = () => {
  const [renderAuth, setRenderAuth] = useState(false);
  useEffect(() => setRenderAuth(typeof window !== "undefined"), []);

  const handleSignin = async () => {
    const credential: UserCredential = await signInWithPopup(
      FrontAuth,
      new GoogleAuthProvider()
    );
  };

  return (
    <div>
      <p>E Book Shelf</p>
      {renderAuth && <Button onClick={handleSignin}>サインイン</Button>}
    </div>
  );
};
