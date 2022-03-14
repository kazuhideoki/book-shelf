import { Account } from '../../0.5-entities/account.entity';

export type FrontAuth = Account & {
  tokenId: string;
  accessToken: string;
};

export type ServerAuth = Account & {
  accountId: string;
  accessToken?: string;
};
