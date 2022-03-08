import { Module } from '@nestjs/common';
import { SettingServerFirebase } from '../0-base/setting-server-firebase';

@Module({
  providers: [SettingServerFirebase],
})
export class BaseModule {}
