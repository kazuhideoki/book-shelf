import { AxiosRequestConfig, Method } from 'axios';
import { AuthContext } from '../../../../front/src/old-server/helper/auth-context';
import { axiosRequest } from '../../0-base/axios';

export const daxiosRequest = async <T>(
  method: Method,
  url: string,
  config?: AxiosRequestConfig<any>,
): Promise<T> => {
  const res = await axiosRequest<T>(method, url, {
    ...config,
    headers: {
      Authorization: `Bearer ${AuthContext.instance.auth.accessToken}`,
    },
  });

  return res;
};
