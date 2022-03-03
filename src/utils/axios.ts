import { AxiosRequestConfig, default as axios, Method } from "axios";
import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import { authState } from "../recoil/atom/auth";
import { FrontAuth } from "../type/model/auth";
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

export const axiosRequestToServer =
  (auth?: FrontAuth) =>
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
    let headers: any = {
      ...config?.headers,
      Authorization: `Bearer ${auth?.tokenId}/${auth?.accessToken}`,
    };

    console.log({ headers });

    return await axiosRequest<T>(method, url, {
      ...config,
      headers,
    });
  };

export const useRequest = () => {
  const { auth } = useRecoilValue(authState);

  return useCallback(axiosRequestToServer(auth), [auth]);
};
