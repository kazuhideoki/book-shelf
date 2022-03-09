import { Inject, Injectable } from '@nestjs/common';
import { ServerAuth } from '../../../type/model/auth';
import { HttpsError } from './https-error';

@Injectable()
export class AuthContext {
  private static _instance: AuthContext;
  constructor(@Inject('AUTH_CONTEXT_INIT') auth: ServerAuth) {
    this._auth = auth;
  }

  _auth?: ServerAuth;
  _initialized: boolean;

  get auth() {
    return this.instance()._auth;
  }
  get initialized() {
    return this.instance()._initialized;
  }

  instance() {
    if (!AuthContext._instance._auth) {
      throw new HttpsError('internal', `AuthContext is not set`);
    }
    return AuthContext._instance;
  }

  init() {
    AuthContext._instance = undefined;
  }

  set(v: ServerAuth) {
    if (AuthContext._instance?._auth) {
      throw new HttpsError('internal', `AuthContext is already set`);
    }

    AuthContext._instance = new AuthContext(v);
    this._initialized = true;
    return AuthContext._instance;
  }

  destroy() {
    this._initialized = false;
    this._auth = undefined;
  }
}
