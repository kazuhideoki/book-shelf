import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Scope,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { AuthContext } from '../0-base/auth-context';
import { AccountRepository } from '../1-repositories/account.repository';

@Injectable({ scope: Scope.REQUEST })
export class AuthGuard implements CanActivate {
  constructor(
    readonly configService: ConfigService,
    readonly authContext: AuthContext,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.authContext.init();

    const client = new OAuth2Client(this.configService.get('CLIENT_ID'));

    const req = context.switchToHttp().getRequest();
    const headers = req.headers as any;

    const Authorization = headers.authorization as string;
    const tokens = Authorization?.replace('Bearer ', '').split('/');
    const idToken = tokens[0];
    const accessToken = tokens[1];

    // tokenが古いと Token used too late のエラーになる -> どう処理する？
    const [ticket] = await Promise.all([
      client.verifyIdToken({
        idToken,
        audience: process.env.CLIENT_ID,
      }),
    ]);

    const payload: { name: string; email: string; picture?: string } =
      ticket.getPayload() as any;

    const account = await new AccountRepository().initFind(payload.email);

    this.authContext.set({
      ...account,
      accountId: account?.id,
      accessToken,
    });

    if (!account) {
      const data = {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      };

      await new AccountRepository().create(data);
    }

    const a = this.authContext.instance();

    return true;
  }
}
