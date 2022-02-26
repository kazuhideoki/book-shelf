import { AxiosRequestConfig, default as axios, Method } from "axios";
import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import { authState } from "../recoil/atom/auth";
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
  const { auth } = useRecoilValue(authState);

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
      let headers: any = {
        ...config?.headers,
        Authorization: `Bearer ${auth?.tokenId}`,
      };

      console.log({ headers });

      return await axiosRequest<T>(method, url, {
        ...config,
        headers,
      });
    },
    [auth?.accessToken]
  );
};
