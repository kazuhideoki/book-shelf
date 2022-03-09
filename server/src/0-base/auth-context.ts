import { HttpException, HttpStatus, Injectable, Scope } from '@nestjs/common';
import { ServerAuth } from '../../../type/model/auth';

@Injectable({ scope: Scope.REQUEST })
export class AuthContext {
  _auth: ServerAuth;

  set(auth: ServerAuth) {
    if (this._auth) {
      throw new HttpException(
        {
          message: 'AuthContext is already set',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    this._auth = auth;
  }

  get auth() {
    return this._auth;
  }
}
