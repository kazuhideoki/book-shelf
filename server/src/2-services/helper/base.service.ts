import { AxiosRequestConfig, Method } from 'axios';
import { AuthContext } from '../../../../front/src/server/helper/auth-context';
import { axiosRequest } from '../../0-base/axios';

export abstract class BaseService {
  constructor(readonly authContext: AuthContext) {
    this.authContext = authContext;
  }

  get accountId() {
    return this.authContext.auth.accountId;
  }

  async daxiosRequest<T>(
    method: Method,
    url: string,
    config?: AxiosRequestConfig<any>,
  ): Promise<T> {
    const res = await axiosRequest<T>(method, url, {
      ...config,
      headers: {
        Authorization: `Bearer ${this.authContext.auth.accessToken}`,
      },
    });

    return res;
  }
}
