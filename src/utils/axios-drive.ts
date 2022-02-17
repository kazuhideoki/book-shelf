import { AxiosRequestConfig, Method } from "axios";
import { axiosRequest } from "./axios";

export async function daxiosRequest<T>(
  method: Method,
  url: string,
  access_token: string,
  config?: AxiosRequestConfig<any>
): Promise<T> {
  const res = await axiosRequest<T>(method, url, {
    ...config,
    headers: { Authorization: `Bearer ${access_token}` },
  });

  return res;
}
