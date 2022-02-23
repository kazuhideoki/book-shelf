import { AxiosRequestConfig, default as axios, Method } from "axios";
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

  return res;
}

export const useRequest = () => {
  const driveAuth = useRecoilValue(driveAuthState);
  const userAuth = useRecoilValue(userAuthState);

  return async function <T, U = any>(
    method: Method,
    url: string,
    config?: {
      params?: U;
      data?: U;
      headers?: any;
    }
  ): Promise<T> {
    let headers: any = {
      ...config?.headers,
      driveAuth: config?.headers.driveAuth ?? driveAuth,
      userAuth: config?.headers.userAuth ?? userAuth,
    };

    if (userAuth?.uid) headers = { ...headers, userId: userAuth.uid };

    return await axiosRequest<T>(method, url, {
      ...config,
      headers,
    });
  };
};
