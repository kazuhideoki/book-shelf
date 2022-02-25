import { AppUser } from "../../type/model/firestore-user.type";

// TODO シングルトンになってる？
export class AuthContext {
  private static _instance: AuthContext;

  private constructor(appUser: AppUser) {
    this.appUser = appUser;
  }

  readonly appUser: AppUser;

  static get instance(): AuthContext {
    if (!this._instance) {
      throw new Error("AuthContext is not set");
    }

    return this._instance;
  }

  static set(appUser: AppUser): AuthContext {
    if (!this._instance) {
      throw new Error("AuthContext is already set");
    }

    return new AuthContext(appUser);
  }
}
