import { v4 } from 'uuid';
import { BaseEntity } from './base.entity';

export class Account extends BaseEntity {
  constructor(data: Partial<Account>) {
    super({ ...data, accountId: data?.accountId || `account_${v4()}` });
  }

  accountId: string;
  name: string;
  email: string;
  picture?: string;
}
