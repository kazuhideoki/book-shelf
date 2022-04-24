import { IntersectionType } from '@nestjs/mapped-types';
import { Account } from '../../0.5-entities/account.entity';

export type FrontAuth = Account & {
  tokenId: string;
  accessToken: string;
};

class _ServerAuth {
  accountId: string;
  accessToken?: string;
}
export class ServerAuth extends IntersectionType(Account, _ServerAuth) {}
