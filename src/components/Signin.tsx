import { NextComponentType, NextPageContext } from "next";
import GoogleLogin, { GoogleLoginResponse } from "react-google-login";
import { useRecoilState } from "recoil";
import { authState } from "../recoil/atom/auth";
import { ServerPath } from "../server/helper/const";
import { Account } from "../type/model/account";
import { axiosRequest } from "../utils/axios";

export const SignIn: NextComponentType<
  NextPageContext,
  Record<string, unknown>,
  Record<string, never>
> = () => {
  const [auth, setAuth] = useRecoilState(authState);

  const handleGoogleAuth = async (googleData: GoogleLoginResponse) => {
    console.log({ googleData });

    const res = await axiosRequest<Account>("POST", ServerPath.self, {
      headers: {
        Authorization: `Bearer ${googleData?.tokenId}`,
      },
    });

    console.log({ res });

    setAuth({
      auth: { ...res, accessToken: googleData.accessToken },
      initialized: true,
    });

    //   - （結果）Topへ飛ばす

    // 検証
    // - 時間が立ったときにアクセスできるかどうか？
  };

  return (
    <div>
      <p>E Book Shelf</p>
      <GoogleLogin
        clientId={process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_CLIENT_ID!}
        isSignedIn={true}
        buttonText="Login"
        onSuccess={(res) => handleGoogleAuth(res as GoogleLoginResponse)}
        onFailure={(failure) => console.log({ failure })}
        scope={"https://www.googleapis.com/auth/drive"}
        cookiePolicy={"single_host_origin"}
      />
    </div>
  );
};
