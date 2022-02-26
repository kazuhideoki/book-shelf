import { Account } from "../../type/model/account";
import { Context, ContextHolder } from "./context";

/**
 * 1 APIリクエストの中で不変なインスタンス
 */
export class AuthContext extends Context {
  /**
   * @param account 現行コンテキストで認証済みの Account
   */
  constructor(readonly account: Account) {
    super();
  }

  static get instance() {
    return ContextHolder.get(AuthContext);
  }
}
