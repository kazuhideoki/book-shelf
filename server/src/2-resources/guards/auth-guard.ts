import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Scope,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { AuthContext } from '../../0-base/auth-context';
import { AccountRepository } from '../../1-repositories/account.repository';
import { Account } from '../../type/model/account';

@Injectable({ scope: Scope.REQUEST })
export class AuthGuard implements CanActivate {
  constructor(
    readonly configService: ConfigService,
    readonly accountRepository: AccountRepository,
    readonly authContext: AuthContext,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const headers = req.headers as any;

    const Authorization = headers.authorization as string;
    const tokens = Authorization?.replace('Bearer ', '').split('/');
    const idToken = tokens[0];
    const accessToken = tokens[1];
    const isLocal = !!this.configService.get<string>('RUN_ON_LOCAL');

    await this.verifyIdToken(idToken, accessToken, isLocal);

    return true;
  }

  async verifyIdToken(
    idToken: string,
    accessToken: string,
    isLocal: boolean,
  ): Promise<Account> {
    const client = new OAuth2Client();

    if (
      isLocal &&
      idToken.match(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      )
    ) {
      const account = await this.accountRepository.findOrRegister({
        email: idToken,
        name: `Dev ${idToken.split('@')[0]}`,
      });

      this.authContext.set({
        ...account,
        accountId: account?.id,
        accessToken,
      });

      return account;
    }

    // tokenが古いと Token used too late のエラーになる -> どう処理する？
    const [ticket] = await Promise.all([
      client.verifyIdToken({
        idToken,
      }),
    ]);

    const payload: { name: string; email: string; picture?: string } =
      ticket.getPayload() as any;

    const account = await this.accountRepository.findOrRegister(payload);

    this.authContext.set({
      ...account,
      accountId: account?.id,
      accessToken,
    });

    if (!account) {
      const data: Account = {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      };

      await this.accountRepository.create(data);

      return data;
    }

    return account;
  }
}
