import { Account } from './account';

export type FrontAuth = Account & {
  tokenId: string;
  accessToken: string;
};

export type ServerAuth = Account & {
  accountId: string;
  accessToken?: string;
};
