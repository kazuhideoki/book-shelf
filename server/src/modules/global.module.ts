import { Global, Module } from '@nestjs/common';
import { FirebaseSetting } from '../0-base/initialize-firebaes';

@Global()
@Module({
  providers: [FirebaseSetting],
  exports: [FirebaseSetting],
})
export class GlobalModule {}
