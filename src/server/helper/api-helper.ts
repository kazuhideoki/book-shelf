import { AxiosRequestConfig, Method } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { axiosRequest } from "../../utils/axios";

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

  get userId() {
    return this.req.headers.userid; // headers経由でキャメルケースが小文字になる
  }

  /**
   *  Google Drive APIへのリクエスト
   */
  async daxiosRequest<T>(
    method: Method,
    url: string,
    config?: AxiosRequestConfig<any>
  ): Promise<T> {
    const { access_token } = this.req.headers;

    const res = await axiosRequest<T>(method, url, {
      ...config,
      headers: { Authorization: `Bearer ${access_token}` },
    });

    return res;
  }

  handler(p: {
    get?: () => void;
    post?: () => void;
    error?: () => never;
  }): void {
    const { get, post, error } = p;
    console.log(`⭐  ${this.req.url}`);

    try {
      switch (this.req.method) {
        case "GET":
          get?.();
          break;
        case "POST":
          post?.();
          break;

        default:
          break;
      }
      console.log(`🔵  ${this.req.url}`);
    } catch (e) {
      if (error) {
        error();
      } else {
        console.log({ error });
        this.res.status(500);
        this.res.end();
      }
    }
  }
}
