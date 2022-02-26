import { Account } from "./account";

export type FrontAuth = Account & {
  tokenId?: string;
  accessToken?: string;
};
