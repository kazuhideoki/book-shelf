import { ServerAuth } from "../../type/model/auth";
import { Context, ContextHolder } from "./context";

/**
 * 1 APIリクエストの中で不変なインスタンス
 */
export class AuthContext extends Context {
  /**
   * @param auth 現行コンテキストで認証済みの Account
   */
  constructor(readonly auth: ServerAuth) {
    super();
  }

  static get instance() {
    return ContextHolder.get(AuthContext);
  }
}
