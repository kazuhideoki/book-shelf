import { AxiosRequestConfig, default as axios, Method } from "axios";
import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import { driveAuthState } from "../recoil/atom/drive-auth";
import { userAuthState } from "../recoil/atom/user-auth";
const instance = axios.create();

export async function axiosRequest<T>(
  method: Method,
  url: string,
  config?: AxiosRequestConfig<any>
): Promise<T> {
  let res: T = await instance
    .request<T>({
      method,
      url,
      ...config,
    })
    .then((r) => r.data);

  console.log(`axiosRequest`);
  console.log({ config });

  return res;
}

export const useRequest = () => {
  const userAuth = useRecoilValue(userAuthState);
  const driveAuth = useRecoilValue(driveAuthState);

  console.log({ driveAuth, userAuth });

  return useCallback(
    async <T, U = any>(
      method: Method,
      url: string,
      config?: {
        params?: U;
        data?: U;
        headers?: any;
      }
    ): Promise<T> => {
      console.log({ config });
      const da = config?.headers?.driveAuth ?? driveAuth?.driveAuth;
      const ua = config?.headers?.userAuth ?? userAuth?.userAuth;
      let headers: any = {
        ...config?.headers,
        driveAuth: da ? JSON.stringify(da) : undefined,
        userAuth: ua ? JSON.stringify(ua) : undefined,
        userId: config?.headers?.userId ?? userAuth?.userAuth?.uid,
      };

      console.log({ headers });

      return await axiosRequest<T>(method, url, {
        ...config,
        headers,
      });
    },
    [userAuth?.userAuth, driveAuth?.driveAuth]
  );
};
