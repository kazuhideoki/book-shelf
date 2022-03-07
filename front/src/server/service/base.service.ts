import { AxiosRequestConfig, Method } from "axios";
import { axiosRequest } from "../../utils/axios";
import { AuthContext } from "../helper/auth-context";

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
    config?: AxiosRequestConfig<any>
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
