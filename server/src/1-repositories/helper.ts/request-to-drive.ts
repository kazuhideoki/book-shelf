import { AxiosRequestConfig, Method } from 'axios';
import { axiosRequest } from '../../0-base/axios';

export const daxiosRequest = async <T>(
  method: Method,
  url: string,
  accessToken: string,
  config?: AxiosRequestConfig<any>,
): Promise<T> => {
  const res = await axiosRequest<T>(method, url, {
    ...config,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return res;
};
