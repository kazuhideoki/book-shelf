import { AxiosRequestConfig, default as axios, Method } from "axios";
import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import { FrontAuth } from "../../../server/src/type/model/auth";
import { authState } from "../recoil/atom/auth";

const instance = axios.create();

// axios.defaults.baseURL = "http://localhost:8080";
// axios.defaults.headers.post["Content-Type"] = "application/json;charset=utf-8";
// axios.defaults.headers.get["Content-Type"] = "application/json;charset=utf-8";
// axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
// axios.defaults.headers.get["Access-Control-Allow-Origin"] = "*";

export async function axiosRequest<T>(
  method: Method,
  url: string,
  config?: AxiosRequestConfig<any>
): Promise<T> {
  console.log({ method, config, url });

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
      "Access-Control-Allow-Origin": "*",
    };

    return await axiosRequest<T>(
      method,
      `${process.env.NEXT_PUBLIC_WEB_SERVICE_URL}${url}`,
      {
        ...config,
        headers,
      }
    );
  };

export const useRequest = () => {
  const { auth } = useRecoilValue(authState);

  return useCallback(axiosRequestToServer(auth), [auth]);
};
