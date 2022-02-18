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

  console.log({ driveAuth, uid: userAuth?.uid });

  return <T>(method: Method, url: string, config?: any) =>
    axiosRequest<T>(method, url, {
      ...config,
      headers: { ...config?.headers, ...driveAuth, userId: userAuth?.uid },
    });
};
