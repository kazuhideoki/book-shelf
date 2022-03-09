import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { AuthContext } from '../../../front/src/old-server/helper/auth-context';
import { ContextHolder } from '../../../front/src/old-server/helper/context';
import { AccountRepository } from '../1-repositories/account.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(readonly configService = new ConfigService()) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const client = new OAuth2Client(process.env.CLIENT_ID);
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

    console.log({ ticket });

    const payload: { name: string; email: string; picture?: string } =
      ticket.getPayload() as any;

    console.log({ payload });

    const account = await new AccountRepository().initFind(payload.email);
    console.log(account);

    const authContext = new AuthContext({
      ...account,
      accountId: account?.id,
      accessToken,
    });

    ContextHolder.set(authContext);

    if (!account) {
      const data = {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      };

      await new AccountRepository().create(data);
    }

    return true;
  }
}
