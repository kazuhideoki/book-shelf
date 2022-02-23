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

  console.log(`axiosRequest`);
  console.log({ config });

  return res;
}

export const useRequest = () => {
  const driveAuth = useRecoilValue(driveAuthState);
  const userAuth = useRecoilValue(userAuthState);

  console.log({ driveAuth, userAuth });

  return async function <T, U = any>(
    method: Method,
    url: string,
    config?: {
      params?: U;
      data?: U;
      headers?: any;
    }
  ): Promise<T> {
    console.log({ config });
    let headers: any = {
      ...config?.headers,
      driveAuth: config?.headers.driveAuth ?? driveAuth,
      userAuth: config?.headers.userAuth ?? userAuth,
      userId: config?.headers.userId ?? userAuth?.userAuth?.uid,
    };

    console.log({ headers });

    return await axiosRequest<T>(method, url, {
      ...config,
      headers,
    });
  };
};
