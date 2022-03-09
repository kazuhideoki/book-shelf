import { Inject, Injectable, Scope } from '@nestjs/common';
import { HttpsError } from '../../../front/src/old-server/helper/https-error';
import { ServerAuth } from '../../../type/model/auth';

@Injectable({ scope: Scope.REQUEST })
export class NewAuthContext {
  private static _instance: NewAuthContext;
  constructor(@Inject('AUTH_CONTEXT_INIT') auth: ServerAuth) {
    this.auth = auth;
  }
  auth?: ServerAuth;
  initialized: boolean;

  instance() {
    if (!NewAuthContext._instance.auth) {
      throw new HttpsError('internal', `AuthContext is not set`);
    }
    return NewAuthContext._instance;
  }

  init() {
    NewAuthContext._instance = undefined;
  }

  set(v: ServerAuth) {
    if (NewAuthContext._instance?.auth) {
      throw new HttpsError('internal', `AuthContext is already set`);
    }

    NewAuthContext._instance = new NewAuthContext(v);
    this.initialized = true;
    return NewAuthContext._instance;
  }

  destroy() {
    this.initialized = false;
    this.auth = undefined;
  }
}
