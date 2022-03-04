import { AxiosRequestConfig, Method } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { CustomError } from "../../type/model/error";
import { axiosRequest } from "../../utils/axios";
import { AuthContext } from "./auth-context";
import { ContextHolder } from "./context";
import { HttpsError } from "./https-error";
import { middleware } from "./middleware";

export class ApiHelper {
  readonly req: NextApiRequest;
  readonly res: NextApiResponse;

  constructor(req: NextApiRequest, res: NextApiResponse) {
    this.req = req;
    this.res = res;
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
  get auth() {
    return AuthContext.instance.auth;
  }
  get accountId() {
    return this.auth.accountId;
  }

  /**
   *  Google Drive APIへのリクエスト
   */
  async daxiosRequest<T>(
    method: Method,
    url: string,
    config?: AxiosRequestConfig<any>
  ): Promise<T> {
    const res = await axiosRequest<T>(method, url, {
      ...config,
      headers: {
        Authorization: `Bearer ${this.auth.accessToken}`,
      },
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
    ContextHolder.initContext();

    const { get, post, patch, delete: Delete, error } = p;
    console.log(`⭐ ${this.req.method} ${this.req.url}`);

    try {
      await middleware(this.req);

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

      let customError: CustomError, status, msg, customErrorCode;

      customError = {
        status: status ?? e.status ?? 500,
        msg: msg ?? e.message ?? `Unknown error occurred`,
        customErrorCode,
      };

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

      customError = {
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
}
