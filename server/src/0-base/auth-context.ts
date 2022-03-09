import { Inject, Injectable, Scope } from '@nestjs/common';
import { ServerAuth } from '../../../type/model/auth';
import { HttpsError } from './https-error';

@Injectable({ scope: Scope.REQUEST })
export class AuthContext {
  private static _instance: AuthContext;
  constructor(@Inject('AUTH_CONTEXT_INIT') auth: ServerAuth) {
    this.auth = auth;
  }
  auth?: ServerAuth;
  initialized: boolean;

  instance() {
    if (!AuthContext._instance.auth) {
      throw new HttpsError('internal', `AuthContext is not set`);
    }
    return AuthContext._instance;
  }

  init() {
    AuthContext._instance = undefined;
  }

  set(v: ServerAuth) {
    if (AuthContext._instance?.auth) {
      throw new HttpsError('internal', `AuthContext is already set`);
    }

    AuthContext._instance = new AuthContext(v);
    this.initialized = true;
    return AuthContext._instance;
  }

  destroy() {
    this.initialized = false;
    this.auth = undefined;
  }
}
