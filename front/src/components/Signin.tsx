import { NextComponentType, NextPageContext } from "next";
import GoogleLogin, { GoogleLoginResponse } from "react-google-login";
import { useRecoilState } from "recoil";
import { Account } from "../../../type/model/account";
import { authState } from "../recoil/atom/auth";
import { axiosRequest } from "../utils/axios";
import { ServerPath } from "../utils/const";
import { useWithLoading } from "../utils/with-loading";

export const SignIn: NextComponentType<
  NextPageContext,
  Record<string, unknown>,
  Record<string, never>
> = () => {
  const withLoading = useWithLoading();
  const [auth, setAuth] = useRecoilState(authState);

  const handleGoogleAuth = async (googleData: GoogleLoginResponse) => {
    console.log({ googleData });

    const res = await withLoading(
      axiosRequest<Account>(
        "GET",
        `${process.env.NEXT_PUBLIC_WEB_SERVICE_URL}${ServerPath.self}`,
        {
          headers: {
            Authorization: `Bearer ${googleData?.tokenId}/${googleData.accessToken}`,
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
    );

    console.log({ res });

    setAuth({
      auth: {
        ...res,
        tokenId: googleData.tokenId,
        accessToken: googleData.accessToken,
      },
      initialized: true,
    });
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
        // この設定でrefreashTokenを取得するためのcodeをgetできる うごくな。。。
        accessType="offline"
        responseType="code"
        scope={"https://www.googleapis.com/auth/drive"}
        cookiePolicy={"single_host_origin"}
      />
    </div>
  );
};
