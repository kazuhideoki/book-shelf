import { Injectable, Scope } from '@nestjs/common';
import { HttpsError } from '../../../front/src/old-server/helper/https-error';
import { ServerAuth } from '../../../type/model/auth';

@Injectable({ scope: Scope.REQUEST })
export class NewAuthContext {
  private static _instance: NewAuthContext;
  private constructor(auth: ServerAuth) {
    this.auth = auth;
  }
  auth: ServerAuth;
  static instance() {
    if (!NewAuthContext._instance) {
      throw new HttpsError('internal', `AuthContext is not set`);
    }
    return NewAuthContext._instance;
  }

  static set(v: ServerAuth) {
    if (NewAuthContext._instance) {
      throw new HttpsError('internal', `AuthContext is already set`);
    }
    NewAuthContext._instance = new NewAuthContext(v);
    return NewAuthContext._instance;
  }
}
