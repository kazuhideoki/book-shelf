import { AxiosRequestConfig, Method } from "axios";
import { AppUser } from "../../type/model/firestore-user.type";
import { axiosRequest } from "../../utils/axios";

export abstract class BaseService {
  constructor(readonly appUser: AppUser) {
    this.appUser = appUser;
  }

  async daxiosRequest<T>(
    method: Method,
    url: string,
    config?: AxiosRequestConfig<any>
  ): Promise<T> {
    const res = await axiosRequest<T>(method, url, {
      ...config,
      headers: {
        Authorization: `Bearer ${this.appUser.driveAuth.access_token}`,
      },
    });

    return res;
  }
}
