import { AxiosRequestConfig, default as axios, Method } from "axios";
const instance = axios.create();

// reduxのauthがセットされる前に利用できるように抽出
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
