import { User } from "@firebase/auth";
import { AxiosRequestConfig, Method } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { CustomError } from "../../type/model/error";
import { AppUser } from "../../type/model/firestore-user.type";
import { DriveAuth } from "../../type/model/google-drive-auth.type";
import { axiosRequest } from "../../utils/axios";
import { collection, toData } from "../service/server_firebase";
import { HttpsError } from "./https-error";

export class ApiHelper {
  readonly req: NextApiRequest;
  readonly res: NextApiResponse;

  constructor(req: NextApiRequest, res: NextApiResponse) {
    this.req = req;
    this.res = res;
  }

  private _appUser: AppUser | undefined;
  private _setAppUser(appUesr: AppUser) {
    this._appUser = appUesr;
  }
  get appUser(): AppUser {
    if (!this._appUser) {
      throw new Error("appUser is not set");
    }
    return this._appUser;
  }

  get query() {
    return this.req.query as any;
  }
  get data() {
    return this.req.body as any;
  }
  get headers() {
    return this.req.headers as any;
  }
  get userId() {
    return this.headers.userid as string; // headers経由でキャメルケースが小文字になる
  }
  get userAuth() {
    return this.headers.userauth
      ? (JSON.parse(this.headers.userauth) as User)
      : undefined;
  }
  get driveAuth() {
    return this.headers.driveauth
      ? (JSON.parse(this.headers.driveauth) as DriveAuth)
      : undefined;
  }

  /**
   *  Google Drive APIへのリクエスト
   */
  async daxiosRequest<T>(
    method: Method,
    url: string,
    config?: AxiosRequestConfig<any>
  ): Promise<T> {
    const driveAuth = this.driveAuth as any;

    const res = await axiosRequest<T>(method, url, {
      ...config,
      headers: {
        Authorization: `Bearer ${(driveAuth as DriveAuth)?.access_token}`,
      },
    }).catch((e) => {
      if (e.code === 401) {
        // 再びdrive認証して、DBに保存??
        // axiosRequest<DriveAuth>("GET", ServerPath.driveToken, {
        //   params: {
        //     userAuth: user,
        //     userId: user.uid,
        //   },
        //   headers: {
        //     userAuth: JSON.stringify(user) as any,
        //     userId: user.uid,
        //   },
        // });
      }
      throw e;
    });

    return res;
  }

  async handler(p: {
    get?: () => Promise<void>;
    post?: () => Promise<void>;
    patch?: () => Promise<void>;
    delete?: () => Promise<void>;
    error?: () => never;
  }): Promise<void> {
    await this.setAppUser();

    const { get, post, patch, delete: Delete, error } = p;
    console.log(`⭐ ${this.req.method} ${this.req.url}`);

    try {
      switch (this.req.method) {
        case "GET":
          await get?.();
          break;
        case "POST":
          await post?.();
          break;
        case "PATCH":
          await patch?.();
          break;
        case "DELETE":
          await Delete?.();
          break;

        default:
          break;
      }
      console.log(`🔵 ${this.req.method} ${this.req.url}`);
    } catch (e: any) {
      console.error(`❌ ${this.req.method} ${this.req.url}`);

      let status, msg, customErrorCode;

      if (error) {
        error();
      } else {
        if (
          e.constructor.name === HttpsError.name ||
          (e as HttpsError).httpErrorCode?.canonicalName
        ) {
          const httpsError = e as HttpsError;

          status = httpsError.httpErrorCode.canonicalName;
          msg = httpsError.message;
          customErrorCode = httpsError.customErrorCode;
        }
      }

      const customError: CustomError = {
        status: status ?? e.status ?? 500,
        msg: msg ?? e.message ?? `Unknown error occurred`,
        customErrorCode,
      };

      console.error(`${customError.msg}`);

      this.res.status(500);
      this.res.status(status ?? e.status ?? 500).send(customError);
      this.res.end();
    }
  }

  async setAppUser() {
    const userId = this.userId;

    try {
      const appUser = await toData<AppUser>(
        collection("users").doc(userId).get()
      ).catch((e) => {
        console.log({ e });

        console.log(`error occurred in fetch appUser: ${e}`);

        throw e;
      });

      // if (appUser) {
      //   AuthContext.set(appUser);
      // }
      this._setAppUser(appUser);
    } catch (error) {}
  }
}
